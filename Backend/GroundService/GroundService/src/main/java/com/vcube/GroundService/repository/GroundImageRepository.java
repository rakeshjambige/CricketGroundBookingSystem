package com.vcube.GroundService.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vcube.GroundService.model.GroundImage;
@Repository
public interface GroundImageRepository extends JpaRepository<GroundImage, Integer> {
    // You can add custom queries here if needed
}
