package com.healthblog.service;

import com.healthblog.dto.AuthResponse;
import com.healthblog.dto.LoginRequest;
import com.healthblog.dto.SignupRequest;
import com.healthblog.model.User;
import com.healthblog.repository.UserRepository;
import com.healthblog.security.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }
    
    @Transactional
    public AuthResponse signup(SignupRequest request) throws Exception {
        // Validate email and username don't already exist
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new Exception("Email already registered");
        }
        
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new Exception("Username already taken");
        }
        
        // Validate userType
        if (!request.getUserType().equals("Doctor") && !request.getUserType().equals("Patient")) {
            throw new Exception("Invalid user type. Must be 'Doctor' or 'Patient'");
        }
        
        // Create new user
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUserType(request.getUserType());
        user.setAddressLine1(request.getAddressLine1() != null ? request.getAddressLine1() : "");
        user.setCity(request.getCity() != null ? request.getCity() : "");
        user.setState(request.getState() != null ? request.getState() : "");
        user.setPincode(request.getPincode() != null ? request.getPincode() : "");
        user.setProfilePicture("default.jpg");
        
        User savedUser = userRepository.save(user);
        log.info("New {} registered: {}", savedUser.getUserType(), savedUser.getEmail());
        
        // Generate JWT token
        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getUsername(), savedUser.getUserType());
        
        return buildAuthResponse(savedUser, token);
    }
    
    public AuthResponse login(LoginRequest request) throws Exception {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new Exception("Invalid email or password"));
        
        // Validate password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new Exception("Invalid email or password");
        }
        
        // Validate userType matches
        if (!user.getUserType().equals(request.getUserType())) {
            throw new Exception("User type does not match");
        }
        
        log.info("User logged in: {}", user.getEmail());
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getUsername(), user.getUserType());
        
        return buildAuthResponse(user, token);
    }
    
    private AuthResponse buildAuthResponse(User user, String token) {
        return new AuthResponse(
                token,
                user.getEmail(),
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                user.getUserType(),
                user.getId(),
                user.getProfilePicture()   // ← always returns the current picture on login
        );
    }
}
