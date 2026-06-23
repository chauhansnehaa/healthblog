package com.healthblog.service;

import com.healthblog.model.Category;
import com.healthblog.repository.CategoryRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Slf4j
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    
    @Transactional
    public Category createCategory(String name) throws Exception {
        if (categoryRepository.existsByName(name)) {
            throw new Exception("Category already exists");
        }
        
        Category category = new Category();
        category.setName(name);
        
        Category savedCategory = categoryRepository.save(category);
        log.info("New category created: {}", name);
        return savedCategory;
    }
    
    public Category getCategoryByName(String name) throws Exception {
        return categoryRepository.findByName(name)
                .orElseThrow(() -> new Exception("Category not found"));
    }
}
