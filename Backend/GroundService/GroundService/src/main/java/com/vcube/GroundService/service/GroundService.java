package com.vcube.GroundService.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vcube.GroundService.Exception.GroundNotFoundException;
import com.vcube.GroundService.dto.GroundRequestDto;
import com.vcube.GroundService.dto.GroundResponseDto;
import com.vcube.GroundService.model.Ground;
import com.vcube.GroundService.model.GroundImage;
import com.vcube.GroundService.repository.GroundImageRepository;
import com.vcube.GroundService.repository.GroundRepository;
@Service
public class GroundService {

    @Autowired
    private GroundRepository groundRepo;

    @Autowired
    private GroundImageRepository groundImageRepository;

    // ================= CREATE GROUND =================
    public Ground addGround(GroundRequestDto dto) {
        Ground ground = new Ground();
        ground.setName(dto.getName());
        ground.setLocation(dto.getLocation());
        ground.setPricePerHour(dto.getPricePerHour());
        ground.setAvailable(dto.isAvailable());

        Ground savedGround = groundRepo.save(ground);

        if (dto.getImages() != null && !dto.getImages().isEmpty()) {
            List<GroundImage> images = dto.getImages().stream()
                    .map(url -> new GroundImage(null, url, savedGround))
                    .collect(Collectors.toList());
            groundImageRepository.saveAll(images);
        }

        return savedGround;
    }

    // ================= DELETE GROUND =================
    public void deleteGround(int id) {
        Ground ground = groundRepo.findById(id)
                .orElseThrow(() -> new GroundNotFoundException("Ground not found with id " + id));
        groundRepo.delete(ground);
    }

    // ================= UPDATE GROUND =================
 
    public Ground updateGround(int id, GroundRequestDto dto) {
        Ground ground = groundRepo.findById(id)
                .orElseThrow(() -> new GroundNotFoundException("Ground not found with id " + id));

        ground.setName(dto.getName());
        ground.setLocation(dto.getLocation());
        ground.setPricePerHour(dto.getPricePerHour());
        ground.setAvailable(dto.isAvailable());

        // Clear old images and add new ones
        ground.getImages().clear(); 

        if (dto.getImages() != null) {
            dto.getImages().stream()
               .filter(url -> !url.trim().isEmpty())
               .forEach(url -> ground.getImages().add(new GroundImage(url, ground)));
        }

        return groundRepo.save(ground);
    }


    // ================= GET ALL GROUNDS =================
    public List<Ground> getAllGrounds() {
        return groundRepo.findAll();
    }

    // ================= GET GROUND BY ID =================
    public Ground getGroundById(int id) {
        return groundRepo.findById(id)
                .orElseThrow(() -> new GroundNotFoundException("Ground not found with id " + id));
    }

    // ================= HELPER: MAP TO DTO =================
    public GroundResponseDto toDto(Ground g) {
        return new GroundResponseDto(
            g.getId(),
            g.getName(),
            g.getLocation(),
            g.getPricePerHour(),
            g.isAvailable(),
            g.getImages().stream()
             .map(img -> img.getUrl())
             .collect(Collectors.toList())
        );
    }
}
