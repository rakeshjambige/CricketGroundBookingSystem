package com.vcube.BookingService.entity;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "Bookings")
public class BookingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    private int userId;
    private int groundId;   // ONLY keep ID

    private LocalDate bookingDate;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
        name = "booking_slots",
        joinColumns = @JoinColumn(name = "booking_id")
    )
    @Column(name = "slot")
    private List<String> bookedSlots;

    private double totalPrice;
    private String status;
}
