package com.healthblog.service;

import com.healthblog.dto.PostRequest;
import com.healthblog.dto.PostResponse;
import com.healthblog.model.Post;
import com.healthblog.model.User;
import com.healthblog.repository.PostRepository;
import com.healthblog.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class PostService {
    
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    
    public PostService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }
    
    // Get all published posts
    public List<PostResponse> getAllPublishedPosts() {
        return postRepository.findAllPublished().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // Get doctor's drafts
    public List<PostResponse> getDraftsByAuthor(String email) throws Exception {
        User author = userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("User not found"));
        
        return postRepository.findDraftsByAuthor(author).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // Get doctor's published posts
    public List<PostResponse> getPublishedByAuthor(String email) throws Exception {
        User author = userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("User not found"));
        
        return postRepository.findPublishedByAuthor(author).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // Get posts by category
    public List<PostResponse> getPostsByCategory(String category) {
        return postRepository.findByCategory(category).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // Get single post by ID
    public PostResponse getPostById(Long id) throws Exception {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new Exception("Post not found"));
        return convertToResponse(post);
    }
    
    // Create new post
    @Transactional
    public PostResponse createPost(String email, PostRequest request) throws Exception {
        User author = userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("User not found"));
        
        if (!author.getUserType().equals("Doctor")) {
            throw new Exception("Only doctors can create posts");
        }
        
        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setSummary(request.getSummary() != null ? request.getSummary() : "");
        post.setCategory(request.getCategory() != null ? request.getCategory() : "");
        post.setBlogImage("default.jpg");
        post.setStatus(request.getStatus());
        post.setAuthor(author);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        
        Post savedPost = postRepository.save(post);
        log.info("New post created by {}: {}", email, savedPost.getTitle());
        
        return convertToResponse(savedPost);
    }
    
    // Update post
    @Transactional
    public PostResponse updatePost(Long postId, String email, PostRequest request) throws Exception {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new Exception("Post not found"));
        
        // Check authorization
        if (!post.getAuthor().getEmail().equals(email)) {
            throw new Exception("You can only edit your own posts");
        }
        
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setSummary(request.getSummary() != null ? request.getSummary() : "");
        post.setCategory(request.getCategory() != null ? request.getCategory() : "");
        post.setStatus(request.getStatus());
        post.setUpdatedAt(LocalDateTime.now());
        
        Post updatedPost = postRepository.save(post);
        log.info("Post updated by {}: {}", email, updatedPost.getTitle());
        
        return convertToResponse(updatedPost);
    }
    
    // Delete post
    @Transactional
    public void deletePost(Long postId, String email) throws Exception {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new Exception("Post not found"));
        
        // Check authorization
        if (!post.getAuthor().getEmail().equals(email)) {
            throw new Exception("You can only delete your own posts");
        }
        
        postRepository.delete(post);
        log.info("Post deleted by {}: {}", email, post.getTitle());
    }
    
    // Convert entity to DTO
    private PostResponse convertToResponse(Post post) {
        return new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getSummary(),
                post.getCategory(),
                post.getBlogImage(),
                post.getStatus(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                post.getAuthor().getId(),
                post.getAuthor().getFirstName() + " " + post.getAuthor().getLastName(),
                post.getAuthor().getUsername(),
                post.getAuthor().getProfilePicture()
        );
    }
}
