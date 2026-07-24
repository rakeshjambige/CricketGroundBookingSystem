package com.vcube.UserAndAuthService.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vcube.UserAndAuthService.model.User;

import jakarta.persistence.Id;

@Repository
public interface UserRepository extends JpaRepository<User,Integer>{
	
	
	Optional<User> findByEmail(String email);
	
	boolean existsByEmail(String email);
	
	User findById(int id);

	

	

}
