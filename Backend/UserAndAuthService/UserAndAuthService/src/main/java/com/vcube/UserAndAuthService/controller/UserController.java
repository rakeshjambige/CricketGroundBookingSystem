package com.vcube.UserAndAuthService.controller;


import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vcube.UserAndAuthService.model.User;
import com.vcube.UserAndAuthService.service.UserService;

@CrossOrigin(origins = "http://localhost:3000") // React frontend URL
@RestController
@RequestMapping("/api/userauth")
public class UserController {
	@Autowired
	private UserService userService;
	
	@PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User createdUser = userService.register(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }
	
	
	@PostMapping("/login")
	public ResponseEntity<Map<String, Object>> login(@RequestBody User user) {
	    Map<String, Object> res = userService.loginWithUser(user.getEmail(), user.getPassword());
	    return ResponseEntity.ok(res);
	}
	@GetMapping("/{id}")
	public ResponseEntity<User> getUserById(@PathVariable int id) {
	    User user = userService.getUserById(id);
	    if (user != null) {
	        return ResponseEntity.ok(user);
	    } else {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	    }
	}





	

}
