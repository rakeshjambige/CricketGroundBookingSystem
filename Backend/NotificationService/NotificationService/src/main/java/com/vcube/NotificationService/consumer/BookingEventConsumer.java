package com.vcube.NotificationService.consumer;

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

        @KafkaListener(topics = "booking-events", groupId = "notification-group-v2")
        public void consumeBookingEvent(BookingResponseDto bookingDto) {

                System.out.println("EVENT RECEIVED 👉 " + bookingDto);

                // Get user email from Kafka event
                String email = bookingDto.getUserEmail() != null
                                ? bookingDto.getUserEmail()
                                : "default@example.com";

                // Get user name from Kafka event
                String userName = bookingDto.getUserName();

                if (userName == null || userName.trim().isEmpty()) {
                        userName = "Customer";
                }
                // Get ground name
                String groundName = bookingDto.getGroundName() != null
                                ? bookingDto.getGroundName()
                                : "Unknown Ground";

                // Get booked slots
                String slots = (bookingDto.getBookedSlots() != null
                                && !bookingDto.getBookedSlots().isEmpty())
                                                ? String.join(", ", bookingDto.getBookedSlots())
                                                : "No slots booked";

                // Build email message
                String message = "Hello " + userName + ",\n\n" +
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

                                "Thank you for choosing our service!\n\n" +
                                "Regards,\n" +
                                "BookMyGround Team";

                // Send email
                emailService.sendEmail(
                                email,
                                "Booking Confirmation",
                                message);

                System.out.println(
                                "Email sent successfully to: " + email);
        }
}