package com.vcube.BookingService.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.vcube.BookingService.dto.BookingRequestDto;
import com.vcube.BookingService.dto.BookingResponseDto;
import com.vcube.BookingService.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponseDto> createBooking(@RequestBody BookingRequestDto dto) {
        return new ResponseEntity<>(bookingService.createBooking(dto), HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponseDto>> getBookingsByUser(@PathVariable int userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUser(userId));
    }

    @GetMapping("/slots/{groundId}")
    public ResponseEntity<List<String>> getSlotsByGroundAndDate(
            @PathVariable int groundId,
            @RequestParam String date) {
        return ResponseEntity.ok(bookingService.getSlotsByGroundAndDate(groundId, date));
    }
}
