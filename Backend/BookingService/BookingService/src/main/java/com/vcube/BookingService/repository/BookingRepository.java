package com.vcube.BookingService.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.vcube.BookingService.entity.BookingEntity;

public interface BookingRepository extends JpaRepository<BookingEntity, Long> {

    List<BookingEntity> findByUserId(int userId);

    List<BookingEntity> findByGroundIdAndBookingDate(int groundId, LocalDate bookingDate);

    @Query("SELECT b FROM BookingEntity b JOIN b.bookedSlots s " +
           "WHERE b.groundId = :groundId AND b.bookingDate = :bookingDate AND s IN :slots")
    List<BookingEntity> findConflictingBookings(@Param("groundId") int groundId,
                                                @Param("bookingDate") LocalDate bookingDate,
                                                @Param("slots") List<String> slots);
}
