package com.healthblog.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(nullable = false, unique = true)
    private String username;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String userType; // "Doctor" or "Patient"
    
    private String addressLine1;
    private String city;
    private String state;
    private String pincode;
    
    @Column(nullable = false)
    private String profilePicture = "default.jpg";
    
    @Column(nullable = false, updatable = false)
    private Long createdAt = System.currentTimeMillis();
}
