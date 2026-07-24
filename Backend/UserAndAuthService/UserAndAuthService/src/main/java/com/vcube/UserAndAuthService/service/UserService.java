package com.vcube.UserAndAuthService.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.vcube.UserAndAuthService.Exception.EmailAlreadyExistsException;
import com.vcube.UserAndAuthService.Exception.InvalidPasswordException;
import com.vcube.UserAndAuthService.Exception.UserNotFoundException;
import com.vcube.UserAndAuthService.config.JwtUtil;
import com.vcube.UserAndAuthService.model.User;
import com.vcube.UserAndAuthService.model.User.Role;
import com.vcube.UserAndAuthService.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ----------------- REGISTER -----------------
    public User register(User user) {
        // 1️⃣ Check if email exists
        if (userRepo.existsByEmail(user.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists: " + user.getEmail());
        }

        // 2️⃣ Encrypt password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 3️⃣ Set role from frontend, default USER
        if (user.getRole() == null) {
            user.setRole(Role.USER);
        }

        // 4️⃣ Save user
        return userRepo.save(user);
    }

    // ----------------- LOGIN -----------------
    public Map<String, Object> loginWithUser(String email, String password) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // check password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidPasswordException("Invalid password");
        }

        // generate JWT token
        String token = jwtUtil.generateToken(user);

        // prepare response map
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);

        return response;
    }
    
    public User getUserById(int id) {
        return userRepo.findById(id);
    }

}
