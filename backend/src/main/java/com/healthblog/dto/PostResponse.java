package com.healthblog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {
    private Long id;
    private String title;
    private String content;
    private String summary;
    private String category;
    private String blogImage;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Author info
    private Long authorId;
    private String authorName;
    private String authorUsername;
    private String authorProfilePicture;
}
