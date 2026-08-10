package com.vcube.BookingService.repository;


import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vcube.BookingService.entity.BookingSlot;


public interface BookingSlotRepository 
extends JpaRepository<BookingSlot,Long>{




// Check if any selected slots are already booked
List<BookingSlot> findByGroundIdAndBookingDateAndSlotIn(
        int groundId,
        LocalDate bookingDate,
        List<String> slots
);

// Get all booked slots for a ground on a particular date
List<BookingSlot> findByGroundIdAndBookingDate(
        int groundId,
        LocalDate bookingDate
);


}