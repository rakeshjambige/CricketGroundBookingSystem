package com.vcube.GroundService.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vcube.GroundService.dto.GroundRequestDto;
import com.vcube.GroundService.dto.GroundResponseDto;
import com.vcube.GroundService.model.Ground;
import com.vcube.GroundService.service.GroundService;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/grounds")
public class GroundController {

    @Autowired
    private GroundService groundService;

    // ================= GET GROUND BY ID =================
    @GetMapping("/findGroundById/{id}")
    public GroundResponseDto findGroundById(@PathVariable int id) {
        Ground ground = groundService.getGroundById(id);
        return groundService.toDto(ground);
    }

    // ================= GET ALL GROUNDS =================
    @GetMapping("/getAllGrounds")
    public List<GroundResponseDto> getAllGrounds() {
        return groundService.getAllGrounds().stream()
                .map(groundService::toDto)
                .collect(Collectors.toList());
    }

    // ================= ADD GROUND =================
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/addGround")
    public GroundResponseDto addGround(@RequestBody GroundRequestDto dto) {
        Ground saved = groundService.addGround(dto);
        return groundService.toDto(saved);
    }

    // ================= UPDATE GROUND =================
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/updateGroundById/{id}")
    public GroundResponseDto updateGround(@PathVariable int id, @RequestBody GroundRequestDto dto) {
        Ground updated = groundService.updateGround(id, dto);  // pass DTO
        return groundService.toDto(updated);
    }




    // ================= DELETE GROUND =================
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/deleteGroundById/{id}")
    public void deleteGround(@PathVariable int id) {
        groundService.deleteGround(id);
    }
}

