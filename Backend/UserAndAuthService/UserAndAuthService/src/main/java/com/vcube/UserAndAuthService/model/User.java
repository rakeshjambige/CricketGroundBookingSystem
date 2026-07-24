package com.vcube.UserAndAuthService.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="users")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@NotBlank(message="Name is required ")
	private String name;
	
	
	@Email(message="Email should be unique")
	@NotBlank(message="Email is required")
	@Column(nullable=false, unique=true)
	private String email;
	
	
	@NotBlank(message = "Password is required")
	private String password;
	
	@Enumerated(EnumType.STRING)
	private Role role=Role.USER;
	public enum Role{
		USER,ADMIN
		};
	@Column(name="created_at", nullable=false)
	private LocalDateTime createdAt=LocalDateTime.now();
	
	

}
