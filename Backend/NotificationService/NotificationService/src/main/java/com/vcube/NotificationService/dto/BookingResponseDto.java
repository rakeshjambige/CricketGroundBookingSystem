package com.vcube.NotificationService.dto;

import java.time.LocalDate;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseDto {

    private Long bookingId;
    private int userId;
    private int groundId;
    private String groundName;
    private LocalDate bookingDate;
    private List<String> bookedSlots;
    private double totalPrice;
    private String status;
    private String userEmail;
}

