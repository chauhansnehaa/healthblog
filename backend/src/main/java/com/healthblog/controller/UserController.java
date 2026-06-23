package com.healthblog.controller;

import com.healthblog.model.User;
import com.healthblog.repository.UserRepository;
import com.healthblog.service.FileStorageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
@Slf4j
public class UserController {

    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public UserController(UserRepository userRepository, FileStorageService fileStorageService) {
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    // Get current user's profile
    @GetMapping("/me")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new Exception("User not found"));

            Map<String, Object> profile = buildProfileResponse(user);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Upload profile picture
    @PostMapping("/upload-profile-picture")
    public ResponseEntity<?> uploadProfilePicture(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }

            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new Exception("User not found"));

            // Delete old profile picture (skip if it's the default)
            if (user.getProfilePicture() != null && !user.getProfilePicture().equals("default.jpg")) {
                fileStorageService.deleteFile(user.getProfilePicture());
            }

            // Save new file
            String newFilename = fileStorageService.storeFile(file);

            // Update user in database
            user.setProfilePicture(newFilename);
            userRepository.save(user);

            log.info("Profile picture updated for user: {}", email);

            Map<String, String> response = new HashMap<>();
            response.put("profilePicture", newFilename);
            response.put("message", "Profile picture updated successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error uploading profile picture: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private Map<String, Object> buildProfileResponse(User user) {
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("firstName", user.getFirstName());
        profile.put("lastName", user.getLastName());
        profile.put("username", user.getUsername());
        profile.put("email", user.getEmail());
        profile.put("userType", user.getUserType());
        profile.put("profilePicture", user.getProfilePicture());
        profile.put("city", user.getCity());
        profile.put("state", user.getState());
        return profile;
    }
}
