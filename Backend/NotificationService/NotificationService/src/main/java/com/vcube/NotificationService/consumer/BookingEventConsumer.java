package com.vcube.NotificationService.consumer;

//import org.springframework.kafka.annotation.KafkaListener;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestTemplate;
//
//import com.vcube.NotificationService.dto.BookingResponseDto;
//import com.vcube.NotificationService.service.EmailService;
//import com.vcube.NotificationService.model.User; // create this class to match UserAuth Service response
//
//@Service
//public class BookingEventConsumer {
//
//    private final EmailService emailService;
//    private final RestTemplate restTemplate;
//
//    public BookingEventConsumer(EmailService emailService, RestTemplate restTemplate) {
//        this.emailService = emailService;
//        this.restTemplate = restTemplate;
//    }
//
//    @KafkaListener(
//            topics = "booking-events",
//            groupId = "notification-group-v2"
//    )
//    public void consumeBookingEvent(BookingResponseDto bookingDto) {
//        System.out.println("EVENT RECEIVED 👉 " + bookingDto);
//
//        // Fetch real user email from UserAuth Service
//        String email;
//        try {
//            String url = "http://localhost:9090/api/userauth/" + bookingDto.getUserId();
//            User user = restTemplate.getForObject(url, User.class);
//            email = (user != null && user.getEmail() != null) ? user.getEmail() : "default@example.com";
//        } catch (Exception e) {
//            email = "default@example.com";
//            System.out.println("Could not fetch user email, using default. Error: " + e.getMessage());
//        }
//
//        // Build the email message
//        String message = "Your booking is confirmed\n\n" +
//                         "Booking ID: " + bookingDto.getBookingId() + "\n" +
//                         "Ground ID: " + bookingDto.getGroundId() + "\n" +
//                         "Date: " + bookingDto.getBookingDate() + "\n" +
//                         "Slots: " + bookingDto.getSlots();
//
//        // Send email
//        emailService.sendEmail(email, "Booking Confirmation", message);
//        System.out.println("Email sent successfully to: " + email);
//    }
//}



import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.vcube.NotificationService.dto.BookingResponseDto;
import com.vcube.NotificationService.service.EmailService;

@Service
public class BookingEventConsumer {

    private final EmailService emailService;

    public BookingEventConsumer(EmailService emailService) {
        this.emailService = emailService;
    }

    @KafkaListener(
            topics = "booking-events",
            groupId = "notification-group-v2"
    )
    public void consumeBookingEvent(BookingResponseDto bookingDto) {

        System.out.println("EVENT RECEIVED 👉 " + bookingDto);

        // Get email directly from Kafka event
        String email = bookingDto.getUserEmail() != null ? bookingDto.getUserEmail() : "default@example.com";
        String groundName = bookingDto.getGroundName() != null ? bookingDto.getGroundName() : "Unknown Ground";
        String slots = (bookingDto.getBookedSlots() != null && !bookingDto.getBookedSlots().isEmpty())
                       ? String.join(", ", bookingDto.getBookedSlots())
                       : "No slots booked";

        // Build email message with all details
        String message = "Hello,\n\n" +
                "Your booking has been confirmed successfully.\n\n" +
                "Booking Details:\n" +
                "----------------------------\n" +
                "Booking ID   : " + bookingDto.getBookingId() + "\n" +
                "Ground Name  : " + groundName + "\n" +
                "Ground ID    : " + bookingDto.getGroundId() + "\n" +
                "Date         : " + bookingDto.getBookingDate() + "\n" +
                "Slots        : " + slots + "\n" +
                "Total Price  : ₹" + bookingDto.getTotalPrice() + "\n" +
                "Status       : " + bookingDto.getStatus() + "\n\n" +
                "Thank you for choosing our service!";

        // Send email
        emailService.sendEmail(email, "Booking Confirmation", message);

        System.out.println("Email sent successfully to: " + email);
    }

}

