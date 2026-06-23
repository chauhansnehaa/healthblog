package com.healthblog.controller;

import com.healthblog.dto.PostRequest;
import com.healthblog.dto.PostResponse;
import com.healthblog.service.PostService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:5173")
@Slf4j
public class PostController {
    
    private final PostService postService;
    
    public PostController(PostService postService) {
        this.postService = postService;
    }
    
    // Get all published posts (public)
    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPublishedPosts() {
        try {
            List<PostResponse> posts = postService.getAllPublishedPosts();
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            log.error("Error fetching posts: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get single post (public)
    @GetMapping("/{id}")
    public ResponseEntity<?> getPost(@PathVariable Long id) {
        try {
            PostResponse post = postService.getPostById(id);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            log.error("Error fetching post: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse(e.getMessage()));
        }
    }
    
    // Get authenticated user's drafts
    @GetMapping("/drafts/my")
    public ResponseEntity<?> getMyDrafts(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse("Unauthorized"));
            }
            
            String email = authentication.getName();
            List<PostResponse> drafts = postService.getDraftsByAuthor(email);
            return ResponseEntity.ok(drafts);
        } catch (Exception e) {
            log.error("Error fetching drafts: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse(e.getMessage()));
        }
    }
    
    // Get authenticated user's published posts
    @GetMapping("/my/published")
    public ResponseEntity<?> getMyPublishedPosts(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse("Unauthorized"));
            }
            
            String email = authentication.getName();
            List<PostResponse> posts = postService.getPublishedByAuthor(email);
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            log.error("Error fetching published posts: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse(e.getMessage()));
        }
    }
    
    // Create new post
    @PostMapping
    public ResponseEntity<?> createPost(
            @Valid @RequestBody PostRequest request,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse("Unauthorized"));
            }
            
            String email = authentication.getName();
            PostResponse post = postService.createPost(email, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(post);
        } catch (Exception e) {
            log.error("Error creating post: {}", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse(e.getMessage()));
        }
    }
    
    // Update post
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody PostRequest request,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse("Unauthorized"));
            }
            
            String email = authentication.getName();
            PostResponse post = postService.updatePost(id, email, request);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            log.error("Error updating post: {}", e.getMessage());
            if (e.getMessage().contains("only edit your own")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse(e.getMessage()));
            }
            return ResponseEntity.badRequest().body(errorResponse(e.getMessage()));
        }
    }
    
    // Delete post
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse("Unauthorized"));
            }
            
            String email = authentication.getName();
            postService.deletePost(id, email);
            return ResponseEntity.ok(Map.of("message", "Post deleted successfully"));
        } catch (Exception e) {
            log.error("Error deleting post: {}", e.getMessage());
            if (e.getMessage().contains("only delete your own")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse(e.getMessage()));
            }
            return ResponseEntity.badRequest().body(errorResponse(e.getMessage()));
        }
    }
    
    private Map<String, String> errorResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("error", message);
        return response;
    }
}
