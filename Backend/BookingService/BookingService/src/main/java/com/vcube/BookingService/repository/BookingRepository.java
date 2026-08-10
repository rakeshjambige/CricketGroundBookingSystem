package com.vcube.BookingService.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vcube.BookingService.entity.BookingEntity;

public interface BookingRepository extends JpaRepository<BookingEntity, Long> {

    List<BookingEntity> findByUserId(int userId);

}