package com.sabinghost19.nati_kld_ml.controller;


import com.sabinghost19.nati_kld_ml.service.ProductService;
import com.sabinghost19.nati_kld_ml.model.ProductChange;
import com.sabinghost19.nati_kld_ml.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Create a new product
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product createdProduct = productService.createProduct(product);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }

    // Get all products
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<Product> products = productService.getAllProducts(page, size);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // Get product by ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        return product.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Update a product
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Product updatedProduct = productService.updateProduct(id, productDetails);
        if (updatedProduct != null) {
            return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Delete a product
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        boolean deleted = productService.deleteProduct(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Find products by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        List<Product> products = productService.getProductsByCategory(category);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // Find products by price range
    @GetMapping("/price")
    public ResponseEntity<List<Product>> getProductsByPriceRange(
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        List<Product> products = productService.getProductsByPriceRange(minPrice, maxPrice);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // Find products with low stock
    @GetMapping("/low-stock")
    public ResponseEntity<List<Product>> getProductsWithLowStock(
            @RequestParam(defaultValue = "10") Integer threshold) {
        List<Product> products = productService.getProductsWithLowStock(threshold);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // Find products by category and maximum price
    @GetMapping("/category/{category}/max-price/{maxPrice}")
    public ResponseEntity<List<Product>> getProductsByCategoryAndMaxPrice(
            @PathVariable String category,
            @PathVariable BigDecimal maxPrice) {
        List<Product> products = productService.getProductsByCategoryAndMaxPrice(category, maxPrice);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // Find products by category with available stock
    @GetMapping("/category/{category}/available")
    public ResponseEntity<List<Product>> getProductsByCategoryWithAvailableStock(
            @PathVariable String category,
            @RequestParam(defaultValue = "1") Integer minimumQuantity) {
        List<Product> products = productService.getProductsByCategoryWithAvailableStock(category, minimumQuantity);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // Get product change history
    @GetMapping("/{id}/history")
    public ResponseEntity<List<ProductChange>> getProductChangeHistory(@PathVariable Long id) {
        List<ProductChange> changes = productService.getProductChangeHistory(id);
        return new ResponseEntity<>(changes, HttpStatus.OK);
    }

    // Get product changes within a time range
    @GetMapping("/{id}/history/period")
    public ResponseEntity<List<ProductChange>> getProductChangesInTimeRange(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date endTime) {
        Instant startInstant = startTime.toInstant();
        Instant endInstant = endTime.toInstant();
        List<ProductChange> changes = productService.getProductChangesInTimeRange(id, startInstant, endInstant);
        return new ResponseEntity<>(changes, HttpStatus.OK);
    }

    // Get recent changes across all products
    @GetMapping("/recent-changes")
    public ResponseEntity<List<ProductChange>> getRecentChanges(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date since) {
        Instant sinceInstant = since.toInstant();
        List<ProductChange> changes = productService.getRecentChanges(sinceInstant);
        return new ResponseEntity<>(changes, HttpStatus.OK);
    }
}