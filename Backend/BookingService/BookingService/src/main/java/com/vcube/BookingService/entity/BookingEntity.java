package com.vcube.BookingService.entity;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name="bookings")
public class BookingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    private int userId;

    private int groundId;

    private LocalDate bookingDate;

    private double totalPrice;

    private String status;

    @OneToMany(
        mappedBy = "booking",
        cascade = CascadeType.ALL,
        fetch = FetchType.LAZY
    )
    private List<BookingSlot> slots;

}