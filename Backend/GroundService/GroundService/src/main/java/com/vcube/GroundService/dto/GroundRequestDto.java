package com.vcube.GroundService.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroundRequestDto {
    private String name;
    private String location;
    private double pricePerHour;
    private boolean available;
    private List<String> images; // list of image URLs
}
