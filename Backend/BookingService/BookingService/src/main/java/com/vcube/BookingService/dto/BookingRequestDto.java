package com.vcube.BookingService.dto;

import java.time.LocalDate;
import java.util.List;
import lombok.Data;

@Data
public class BookingRequestDto {
    private int userId;
    private int groundId;
    private LocalDate bookingDate;
    private List<String> slots;
    private double totalPrice;
}
