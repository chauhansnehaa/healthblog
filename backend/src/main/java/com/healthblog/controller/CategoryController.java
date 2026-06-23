package com.healthblog.controller;

import com.healthblog.model.Category;
import com.healthblog.service.CategoryService;
import com.healthblog.service.PostService;
import com.healthblog.dto.PostResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:5173")
@Slf4j
public class CategoryController {
    
    private final CategoryService categoryService;
    private final PostService postService;
    
    public CategoryController(CategoryService categoryService, PostService postService) {
        this.categoryService = categoryService;
        this.postService = postService;
    }
    
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        try {
            List<Category> categories = categoryService.getAllCategories();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            log.error("Error fetching categories: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole")
    public ResponseEntity<?> createCategory(@RequestBody Map<String, String> request) {
        try {
            String categoryName = request.get("name");
            if (categoryName == null || categoryName.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(errorResponse("Category name is required"));
            }
            
            Category category = categoryService.createCategory(categoryName);
            return ResponseEntity.status(HttpStatus.CREATED).body(category);
        } catch (Exception e) {
            log.error("Error creating category: {}", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/{name}/posts")
    public ResponseEntity<List<PostResponse>> getPostsByCategory(@PathVariable String name) {
        try {
            List<PostResponse> posts = postService.getPostsByCategory(name);
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            log.error("Error fetching posts by category: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    private Map<String, String> errorResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("error", message);
        return response;
    }
}
