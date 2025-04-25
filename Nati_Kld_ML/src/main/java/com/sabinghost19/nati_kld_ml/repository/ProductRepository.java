package com.sabinghost19.nati_kld_ml.repository;

import com.sabinghost19.nati_kld_ml.model.Product;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends CassandraRepository<Product, UUID> {

    List<Product> findByCategory(String category);

    Optional<Product> findByName(String name);

    List<Product> findByPriceLessThan(BigDecimal price);

    List<Product> findByPriceGreaterThan(BigDecimal price);

    List<Product> findByQuantityLessThan(Integer quantity);

    @Query("SELECT * FROM products WHERE category = ?0 AND price < ?1 ALLOW FILTERING")
    List<Product> findByCategoryAndPriceLessThan(String category, BigDecimal price);

    @Query("SELECT * FROM products WHERE category = ?0 AND quantity > ?1 ALLOW FILTERING")
    List<Product> findByCategoryWithAvailableStock(String category, Integer minimumQuantity);
}