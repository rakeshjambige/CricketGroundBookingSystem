package com.vcube.BookingService.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroundDto {
    private int id;
    private String name;
    private String location;
    private double pricePerHour;
    private boolean available;     // match GroundResponseDto
    private List<String> images;   // match GroundResponseDto
}
