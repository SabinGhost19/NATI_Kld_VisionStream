package com.sabinghost19.nati_kld_ml.service;


import com.sabinghost19.nati_kld_ml.model.ProductChange;
import com.sabinghost19.nati_kld_ml.model.Product;
import com.sabinghost19.nati_kld_ml.repository.ProductChangeRepository;
import com.sabinghost19.nati_kld_ml.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductChangeRepository productChangeRepository;

    @Autowired
    public ProductService(ProductRepository productRepository, ProductChangeRepository productChangeRepository) {
        this.productRepository = productRepository;
        this.productChangeRepository = productChangeRepository;
    }

    // Create a new product
    public Product createProduct(Product product) {
        if (product.getId() == null) {
            product.setId(UUID.randomUUID());
        }

        Product savedProduct = productRepository.save(product);

        // Record the creation in the product_changes table
        ProductChange change = new ProductChange(
                savedProduct.getId(),
                Instant.now(),
                "INSERT",
                null,
                savedProduct.getPrice(),
                null,
                savedProduct.getQuantity()
        );

        productChangeRepository.save(change);

        return savedProduct;
    }

    // Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Get product by ID
    public Optional<Product> getProductById(UUID id) {
        return productRepository.findById(id);
    }

    // Update a product
    public Product updateProduct(UUID id, Product productDetails) {
        Optional<Product> productOpt = productRepository.findById(id);

        if (productOpt.isPresent()) {
            Product existingProduct = productOpt.get();

            // Record changes for auditing
            ProductChange change = new ProductChange(
                    id,
                    Instant.now(),
                    "UPDATE",
                    existingProduct.getPrice(),
                    productDetails.getPrice(),
                    existingProduct.getQuantity(),
                    productDetails.getQuantity()
            );

            // Update product details
            existingProduct.setName(productDetails.getName());
            existingProduct.setDescription(productDetails.getDescription());
            existingProduct.setPrice(productDetails.getPrice());
            existingProduct.setQuantity(productDetails.getQuantity());
            existingProduct.setCategory(productDetails.getCategory());

            // Save product changes first
            productChangeRepository.save(change);

            // Save updated product
            return productRepository.save(existingProduct);
        }

        return null; // Product not found
    }

    // Delete a product
    public boolean deleteProduct(UUID id) {
        Optional<Product> productOpt = productRepository.findById(id);

        if (productOpt.isPresent()) {
            Product product = productOpt.get();

            // Record the deletion in product_changes
            ProductChange change = new ProductChange(
                    id,
                    Instant.now(),
                    "DELETE",
                    product.getPrice(),
                    null,
                    product.getQuantity(),
                    null
            );

            productChangeRepository.save(change);
            productRepository.deleteById(id);
            return true;
        }

        return false; // Product not found
    }

    // Find products by category
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    // Find products by price range
    public List<Product> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        if (minPrice != null && maxPrice != null) {
            return productRepository.findAll().stream()
                    .filter(p -> p.getPrice().compareTo(minPrice) >= 0 && p.getPrice().compareTo(maxPrice) <= 0)
                    .toList();
        } else if (minPrice != null) {
            return productRepository.findByPriceGreaterThan(minPrice);
        } else if (maxPrice != null) {
            return productRepository.findByPriceLessThan(maxPrice);
        }
        return productRepository.findAll();
    }

    // Find products with low stock
    public List<Product> getProductsWithLowStock(Integer threshold) {
        return productRepository.findByQuantityLessThan(threshold);
    }

    // Find products by category and maximum price
    public List<Product> getProductsByCategoryAndMaxPrice(String category, BigDecimal maxPrice) {
        return productRepository.findByCategoryAndPriceLessThan(category, maxPrice);
    }

    // Find products by category with available stock
    public List<Product> getProductsByCategoryWithAvailableStock(String category, Integer minimumQuantity) {
        return productRepository.findByCategoryWithAvailableStock(category, minimumQuantity);
    }

    // Get product change history
    public List<ProductChange> getProductChangeHistory(UUID productId) {
        return productChangeRepository.findByProductId(productId);
    }

    // Get product changes within a time range
    public List<ProductChange> getProductChangesInTimeRange(UUID productId, Instant startTime, Instant endTime) {
        return productChangeRepository.findByProductIdAndTimeRange(productId, startTime, endTime);
    }

    // Get recent changes across all products
    public List<ProductChange> getRecentChanges(Instant since) {
        return productChangeRepository.findRecentChanges(since);
    }
}