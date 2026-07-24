package com.vcube.GroundService.dto;


import java.util.List;

public class GroundResponseDto {
    private int id;
    private String name;
    private String location;
    private double pricePerHour;
    private boolean available;
    private List<String> images;

    public GroundResponseDto() {}

    public GroundResponseDto(int id, String name, String location, double pricePerHour, boolean available, List<String> images) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.pricePerHour = pricePerHour;
        this.available = available;
        this.images = images;
    }

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public double getPricePerHour() { return pricePerHour; }
    public void setPricePerHour(double pricePerHour) { this.pricePerHour = pricePerHour; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
}
