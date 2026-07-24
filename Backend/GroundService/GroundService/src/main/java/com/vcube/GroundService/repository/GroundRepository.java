package com.vcube.GroundService.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vcube.GroundService.model.Ground;

@Repository
public interface GroundRepository extends JpaRepository<Ground,Integer>{
	


}
