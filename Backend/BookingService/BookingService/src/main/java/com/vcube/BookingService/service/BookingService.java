package com.vcube.BookingService.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.vcube.BookingService.dto.BookingRequestDto;
import com.vcube.BookingService.dto.BookingResponseDto;
import com.vcube.BookingService.dto.GroundDto;
import com.vcube.BookingService.dto.UserDto;
import com.vcube.BookingService.entity.BookingEntity;
import com.vcube.BookingService.entity.BookingSlot;
import com.vcube.BookingService.kafka.BookingEventProducer;
import com.vcube.BookingService.repository.BookingRepository;
import com.vcube.BookingService.repository.BookingSlotRepository;

@Service
public class BookingService {

        @Autowired
        private BookingRepository bookingRepository;

        @Autowired
        private BookingSlotRepository bookingSlotRepository;

        @Autowired
        private BookingEventProducer eventProducer;

        @Autowired
        private RestTemplate restTemplate;

        private static final String USER_SERVICE_URL = "http://user-auth-service:9090/api/userauth/{userId}";

        private static final String GROUND_SERVICE_URL = "http://ground-service:9191/api/grounds/findGroundById/{id}";

        // =========================================================
        // CREATE BOOKING
        // =========================================================

        @Transactional
        public BookingResponseDto createBooking(BookingRequestDto dto) {

                // =====================================================
                // 1. VALIDATE BOOKING DATE
                // =====================================================

                LocalDate today = LocalDate.now();
                LocalDate maxBookingDate = today.plusDays(90);

                if (dto.getBookingDate().isBefore(today)) {
                        throw new RuntimeException(
                                        "Cannot book a past date");
                }

                if (dto.getBookingDate().isAfter(maxBookingDate)) {
                        throw new RuntimeException(
                                        "Booking is allowed only up to 90 days in advance");
                }

                // =====================================================
                // 2. CHECK ALREADY BOOKED SLOTS
                // =====================================================

                List<BookingSlot> existingSlots = bookingSlotRepository
                                .findByGroundIdAndBookingDateAndSlotIn(
                                                dto.getGroundId(),
                                                dto.getBookingDate(),
                                                dto.getSlots());

                if (!existingSlots.isEmpty()) {
                        throw new RuntimeException(
                                        "Selected slots are already booked");
                }

                // =====================================================
                // 3. CREATE BOOKING
                // =====================================================

                BookingEntity booking = new BookingEntity();

                booking.setUserId(dto.getUserId());
                booking.setGroundId(dto.getGroundId());
                booking.setBookingDate(dto.getBookingDate());
                booking.setTotalPrice(dto.getTotalPrice());
                booking.setStatus("CONFIRMED");

                // =====================================================
                // 4. CREATE INDIVIDUAL SLOTS
                // =====================================================

                List<BookingSlot> bookingSlots = dto.getSlots()
                                .stream()
                                .map(slot -> {

                                        BookingSlot bookingSlot = new BookingSlot();

                                        bookingSlot.setGroundId(
                                                        dto.getGroundId());

                                        bookingSlot.setBookingDate(
                                                        dto.getBookingDate());

                                        bookingSlot.setSlot(slot);

                                        bookingSlot.setBooking(booking);

                                        return bookingSlot;

                                })
                                .collect(Collectors.toList());

                booking.setSlots(bookingSlots);

                // =====================================================
                // 5. SAVE BOOKING
                // =====================================================

                BookingEntity savedBooking = bookingRepository.save(booking);

                // =====================================================
                // 6. PREPARE RESPONSE
                // =====================================================

                BookingResponseDto response = enrichBookingDto(savedBooking);

                // =====================================================
                // DEBUG KAFKA PAYLOAD
                // =====================================================

                System.out.println("======================================");
                System.out.println("BOOKING EVENT");
                System.out.println("Booking ID : " + response.getBookingId());
                System.out.println("User ID    : " + response.getUserId());
                System.out.println("User Name  : [" + response.getUserName() + "]");
                System.out.println("User Email : [" + response.getUserEmail() + "]");
                System.out.println("Ground     : [" + response.getGroundName() + "]");
                System.out.println("======================================");

                // =====================================================
                // 7. SEND KAFKA EVENT
                // =====================================================

                eventProducer.sendBookingEvent(response);

                return response;
        }

        // =========================================================
        // GET BOOKINGS BY USER
        // =========================================================

        public List<BookingResponseDto> getBookingsByUser(int userId) {

                return bookingRepository
                                .findByUserId(userId)
                                .stream()
                                .map(this::enrichBookingDto)
                                .collect(Collectors.toList());
        }

        // =========================================================
        // GET BOOKED SLOTS
        // =========================================================

        public List<String> getSlotsByGroundAndDate(
                        int groundId,
                        String dateStr) {

                LocalDate date = LocalDate.parse(dateStr);

                return bookingSlotRepository
                                .findByGroundIdAndBookingDate(
                                                groundId,
                                                date)
                                .stream()
                                .map(BookingSlot::getSlot)
                                .collect(Collectors.toList());
        }

        // =========================================================
        // ENRICH BOOKING RESPONSE
        // =========================================================

        private BookingResponseDto enrichBookingDto(
                        BookingEntity booking) {

                UserDto user = fetchUser(booking.getUserId());

                String userName = user != null &&
                                user.getName() != null &&
                                !user.getName().trim().isEmpty()
                                                ? user.getName()
                                                : "Customer";

                String userEmail = user != null &&
                                user.getEmail() != null &&
                                !user.getEmail().trim().isEmpty()
                                                ? user.getEmail()
                                                : "default@example.com";

                String groundName = fetchGroundName(booking.getGroundId());

                List<String> slots = booking.getSlots()
                                .stream()
                                .map(BookingSlot::getSlot)
                                .collect(Collectors.toList());

                return new BookingResponseDto(
                                booking.getBookingId(),
                                booking.getUserId(),
                                booking.getGroundId(),
                                userName,
                                groundName,
                                booking.getBookingDate(),
                                slots,
                                booking.getTotalPrice(),
                                booking.getStatus(),
                                userEmail);
        }

        // =========================================================
        // FETCH USER DETAILS
        // =========================================================

        private UserDto fetchUser(int userId) {

                try {

                        UserDto user = restTemplate.getForObject(
                                        USER_SERVICE_URL,
                                        UserDto.class,
                                        userId);

                        System.out.println("======================================");
                        System.out.println("USER SERVICE RESPONSE");
                        System.out.println("User ID    : " + userId);
                        System.out.println("User Object: " + user);
                        System.out.println("User Name  : [" +
                                        (user != null ? user.getName() : "NULL") + "]");
                        System.out.println("User Email : [" +
                                        (user != null ? user.getEmail() : "NULL") + "]");
                        System.out.println("======================================");

                        return user;

                } catch (Exception e) {

                        System.out.println(
                                        "Failed to fetch user details for userId "
                                                        + userId + " : "
                                                        + e.getMessage());

                        return null;
                }
        }

        // =========================================================
        // FETCH GROUND NAME
        // =========================================================

        private String fetchGroundName(int groundId) {

                try {

                        GroundDto ground = restTemplate.getForObject(
                                        GROUND_SERVICE_URL,
                                        GroundDto.class,
                                        groundId);

                        if (ground != null &&
                                        ground.getName() != null &&
                                        !ground.getName().trim().isEmpty()) {

                                return ground.getName();
                        }

                } catch (Exception e) {

                        System.out.println(
                                        "Failed to fetch ground name : "
                                                        + e.getMessage());
                }

                return "Unknown Ground";
        }
}