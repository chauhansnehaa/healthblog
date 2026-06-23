package com.healthblog.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    private static final List<String> ALLOWED_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
    );

    private static final long MAX_SIZE = 5 * 1024 * 1024; // 5MB

    public String storeFile(MultipartFile file) throws IOException {
        // Validate file
        if (file == null || file.isEmpty()) {
            throw new IOException("File is empty");
        }

        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new IOException("Only image files are allowed (jpg, png, gif, webp)");
        }

        if (file.getSize() > MAX_SIZE) {
            throw new IOException("File size must be less than 5MB");
        }

        // Create uploads directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
            log.info("Created uploads directory: {}", uploadPath.toAbsolutePath());
        }

        // Generate unique filename to avoid collisions
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String uniqueFilename = UUID.randomUUID().toString() + extension;

        // Save file to disk
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath);

        log.info("File saved: {}", uniqueFilename);
        return uniqueFilename;
    }

    public void deleteFile(String filename) {
        if (filename == null || filename.equals("default.jpg")) return;
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename);
            Files.deleteIfExists(filePath);
            log.info("File deleted: {}", filename);
        } catch (IOException e) {
            log.error("Could not delete file: {}", filename, e);
        }
    }
}
