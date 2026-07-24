package com.vcube.GroundService.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ground_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GroundImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String url;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ground_id")
    
    @JsonBackReference
    private Ground ground;

    // ✅ Add this constructor for convenience
    public GroundImage(String url, Ground ground) {
        this.url = url;
        this.ground = ground;
    }
}
