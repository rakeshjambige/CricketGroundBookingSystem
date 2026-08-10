package com.vcube.BookingService.entity;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(
    name="booking_slots",
    uniqueConstraints = {
        @UniqueConstraint(
            name="unique_ground_date_slot",
            columnNames={
                "ground_id",
                "booking_date",
                "slot"
            }
        )
    }
)
public class BookingSlot {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name="ground_id", nullable=false)
    private int groundId;


    @Column(name="booking_date", nullable=false)
    private LocalDate bookingDate;


    @Column(name="slot", nullable=false)
    private String slot;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="booking_id")
    private BookingEntity booking;

}