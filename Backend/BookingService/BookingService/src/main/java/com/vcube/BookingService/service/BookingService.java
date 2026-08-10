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



    private static final String USER_SERVICE_URL =
            "http://localhost:9090/api/userauth/{userId}";


    private static final String GROUND_SERVICE_URL =
            "http://localhost:9191/api/grounds/findGroundById/{id}";



    // ================= CREATE BOOKING =================

    @Transactional
    public BookingResponseDto createBooking(BookingRequestDto dto) {


        // 1. Check already booked slots

        List<BookingSlot> existingSlots =
                bookingSlotRepository.findByGroundIdAndBookingDateAndSlotIn(
                        dto.getGroundId(),
                        dto.getBookingDate(),
                        dto.getSlots()
                );


        if (!existingSlots.isEmpty()) {

            throw new RuntimeException(
                    "Selected slots are already booked"
            );
        }



        // 2. Create Booking

        BookingEntity booking = new BookingEntity();


        booking.setUserId(dto.getUserId());

        booking.setGroundId(dto.getGroundId());

        booking.setBookingDate(dto.getBookingDate());

        booking.setTotalPrice(dto.getTotalPrice());

        booking.setStatus("CONFIRMED");



        // 3. Create individual slots

        List<BookingSlot> bookingSlots =
                dto.getSlots()
                .stream()
                .map(slot -> {


                    BookingSlot bookingSlot = new BookingSlot();


                    bookingSlot.setGroundId(
                            dto.getGroundId()
                    );


                    bookingSlot.setBookingDate(
                            dto.getBookingDate()
                    );


                    bookingSlot.setSlot(slot);


                    bookingSlot.setBooking(booking);


                    return bookingSlot;


                })
                .collect(Collectors.toList());



        booking.setSlots(bookingSlots);



        // 4. Save booking + slots

        BookingEntity savedBooking =
                bookingRepository.save(booking);



        // 5. Prepare response

        BookingResponseDto response =
                enrichBookingDto(savedBooking);



        // 6. Kafka event

        eventProducer.sendBookingEvent(response);



        return response;

    }




    // ================= GET BOOKINGS BY USER =================


    public List<BookingResponseDto> getBookingsByUser(int userId) {


        return bookingRepository
                .findByUserId(userId)
                .stream()
                .map(this::enrichBookingDto)
                .collect(Collectors.toList());

    }





    // ================= GET BOOKED SLOTS =================


    public List<String> getSlotsByGroundAndDate(
            int groundId,
            String dateStr) {


        LocalDate date =
                LocalDate.parse(dateStr);



        return bookingSlotRepository
                .findByGroundIdAndBookingDate(
                        groundId,
                        date
                )
                .stream()
                .map(BookingSlot::getSlot)
                .collect(Collectors.toList());

    }







    // ================= ENRICH RESPONSE =================


    private BookingResponseDto enrichBookingDto(
            BookingEntity booking) {


        String userEmail =
                fetchUserEmail(
                        booking.getUserId()
                );


        String groundName =
                fetchGroundName(
                        booking.getGroundId()
                );



        List<String> slots =
                booking.getSlots()
                .stream()
                .map(BookingSlot::getSlot)
                .collect(Collectors.toList());



        return new BookingResponseDto(

                booking.getBookingId(),

                booking.getUserId(),

                booking.getGroundId(),

                groundName,

                booking.getBookingDate(),

                slots,

                booking.getTotalPrice(),

                booking.getStatus(),

                userEmail

        );

    }







    // ================= FETCH USER EMAIL =================


    private String fetchUserEmail(int userId) {


        try {


            UserDto user =
                    restTemplate.getForObject(
                            USER_SERVICE_URL,
                            UserDto.class,
                            userId
                    );


            if(user != null &&
               user.getEmail()!=null) {


                return user.getEmail();

            }


        }
        catch(Exception e) {


            System.out.println(
                    "Failed to fetch user email : "
                    + e.getMessage()
            );

        }


        return "default@example.com";

    }







    // ================= FETCH GROUND NAME =================


    private String fetchGroundName(int groundId) {


        try {


            GroundDto ground =
                    restTemplate.getForObject(
                            GROUND_SERVICE_URL,
                            GroundDto.class,
                            groundId
                    );


            if(ground != null &&
               ground.getName()!=null) {


                return ground.getName();

            }


        }
        catch(Exception e) {


            System.out.println(
                    "Failed to fetch ground name : "
                    + e.getMessage()
            );

        }


        return "Unknown Ground";

    }


}