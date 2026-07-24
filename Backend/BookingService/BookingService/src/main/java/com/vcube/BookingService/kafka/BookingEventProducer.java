package com.vcube.BookingService.kafka;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.vcube.BookingService.dto.BookingResponseDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingEventProducer {

    private final KafkaTemplate<String, BookingResponseDto> kafkaTemplate;

    private static final String TOPIC = "booking-events";

    public void sendBookingEvent(BookingResponseDto dto) {
        kafkaTemplate.send(TOPIC, dto);
        System.out.println("Booking event sent to Kafka: " + dto);
    }
}

