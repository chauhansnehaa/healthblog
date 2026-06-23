package com.healthblog.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;

@Component
@Slf4j
public class JwtUtil {
    
    @Value("${app.jwt.secret}")
    private String secret;
    
    @Value("${app.jwt.expiration}")
    private long expiration;
    
    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
    
    // Generate JWT token
    public String generateToken(String email, String username, String userType) {
        return Jwts.builder()
                .subject(email)
                .claim("username", username)
                .claim("userType", userType)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getKey())
                .compact();
    }
    
    // Validate token
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }
    
    // Get email from token
    public String getEmailFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return claims.getSubject();
        } catch (JwtException e) {
            log.error("Error extracting email from token: {}", e.getMessage());
            return null;
        }
    }
    
    // Get username from token
    public String getUsernameFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return (String) claims.get("username");
        } catch (JwtException e) {
            log.error("Error extracting username from token: {}", e.getMessage());
            return null;
        }
    }
    
    // Get userType from token
    public String getUserTypeFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return (String) claims.get("userType");
        } catch (JwtException e) {
            log.error("Error extracting userType from token: {}", e.getMessage());
            return null;
        }
    }
}
