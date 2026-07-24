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
import com.vcube.BookingService.kafka.BookingEventProducer;
import com.vcube.BookingService.repository.BookingRepository;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingEventProducer eventProducer;

    @Autowired
    private RestTemplate restTemplate;

    private static final String USER_SERVICE_URL =
            "http://localhost:9090/api/userauth/{userId}";
//
//    private static final String GROUND_SERVICE_URL =
//            "http://localhost:9191/api/grounds/findGroundById/{groundId}";
    private static final String GROUND_SERVICE_URL =
            "http://localhost:9191/api/grounds/findGroundById/{id}"; // <-- {id}, not {groundId}

    // ================= CREATE BOOKING =================
    @Transactional
    public BookingResponseDto createBooking(BookingRequestDto dto) {

        // Check for slot conflicts
        List<BookingEntity> conflicts = bookingRepository.findConflictingBookings(
                dto.getGroundId(),
                dto.getBookingDate(),
                dto.getSlots()
        );

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Selected slots are not available");
        }

        // Save booking
        BookingEntity booking = new BookingEntity();
        booking.setUserId(dto.getUserId());
        booking.setGroundId(dto.getGroundId());
        booking.setBookingDate(dto.getBookingDate());
        booking.setBookedSlots(dto.getSlots());
        booking.setTotalPrice(dto.getTotalPrice());
        booking.setStatus("CONFIRMED");

        BookingEntity saved = bookingRepository.save(booking);

        // Convert to DTO and enrich with user email & ground name
        BookingResponseDto response = enrichBookingDto(saved);

        // Send event to Kafka
        eventProducer.sendBookingEvent(response);

        return response;
    }

    // ================= GET BOOKINGS BY USER =================
    public List<BookingResponseDto> getBookingsByUser(int userId) {
        return bookingRepository.findByUserId(userId)
                .stream()
                .map(this::enrichBookingDto)
                .collect(Collectors.toList());
    }

    // ================= GET BOOKED SLOTS =================
    public List<String> getSlotsByGroundAndDate(int groundId, String dateStr) {
        LocalDate date = LocalDate.parse(dateStr);
        return bookingRepository.findByGroundIdAndBookingDate(groundId, date)
                .stream()
                .flatMap(b -> b.getBookedSlots().stream())
                .collect(Collectors.toList());
    }

    // ================= ENRICH BOOKING DTO =================
    private BookingResponseDto enrichBookingDto(BookingEntity b) {
        String userEmail = fetchUserEmail(b.getUserId());
        String groundName = fetchGroundName(b.getGroundId());

        return new BookingResponseDto(
                b.getBookingId(),
                b.getUserId(),
                b.getGroundId(),
                groundName,
                b.getBookingDate(),
                b.getBookedSlots(),
                b.getTotalPrice(),
                b.getStatus(),
                userEmail
        );
    }

 // ================= FETCH USER EMAIL =================
    private String fetchUserEmail(int userId) {
        try {
            UserDto user = restTemplate.getForObject(USER_SERVICE_URL, UserDto.class, userId);
            if (user != null && user.getEmail() != null) {
                return user.getEmail();
            }
        } catch (Exception e) {
            System.out.println("Failed to fetch user email: " + e.getMessage());
        }
        return "default@example.com";
    }

   
 // ================= FETCH GROUND NAME =================
  
    

    private String fetchGroundName(int groundId) {
        try {
            GroundDto ground = restTemplate.getForObject(GROUND_SERVICE_URL, GroundDto.class, groundId);
            if (ground != null && ground.getName() != null) {
                return ground.getName();
            }
        } catch (Exception e) {
            System.out.println("Failed to fetch ground name: " + e.getMessage());
        }
        return "Unknown Ground";
    }




}
