package com.healthblog.repository;

import com.healthblog.model.Post;
import com.healthblog.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    
    // Get all published posts ordered by latest
    @Query("SELECT p FROM Post p WHERE p.status = 'Published' ORDER BY p.createdAt DESC")
    List<Post> findAllPublished();
    
    // Get doctor's posts (any status)
    List<Post> findByAuthorOrderByCreatedAtDesc(User author);
    
    // Get doctor's draft posts
    @Query("SELECT p FROM Post p WHERE p.author = :author AND p.status = 'Draft' ORDER BY p.createdAt DESC")
    List<Post> findDraftsByAuthor(@Param("author") User author);
    
    // Get doctor's published posts
    @Query("SELECT p FROM Post p WHERE p.author = :author AND p.status = 'Published' ORDER BY p.createdAt DESC")
    List<Post> findPublishedByAuthor(@Param("author") User author);
    
    // Get posts by category
    @Query("SELECT p FROM Post p WHERE p.category = :category AND p.status = 'Published' ORDER BY p.createdAt DESC")
    List<Post> findByCategory(@Param("category") String category);
}
