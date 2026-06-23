package com.healthblog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private String username;
    private String firstName;
    private String lastName;
    private String userType;
    private Long userId;
    private String profilePicture;   // ← carries the stored filename back to the frontend
}
