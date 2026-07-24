package com.vcube.BookingService.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BookingResponseDto {

    private Long bookingId;
    private int userId;
    private int groundId;
    private String groundName;   // ✅ ADD THIS
    private LocalDate bookingDate;
    private List<String> bookedSlots;
    private double totalPrice;
    private String status;
    private String userEmail;
}
