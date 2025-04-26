package com.sabinghost19.nati_kld_ml.repository;


import com.sabinghost19.nati_kld_ml.model.ProductChange;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface ProductChangeRepository extends CassandraRepository<ProductChange, Long> {

    List<ProductChange> findByProductId(Long productId);

    @Query("SELECT * FROM product_changes WHERE product_id = ?0 AND change_timestamp >= ?1 AND change_timestamp <= ?2")
    List<ProductChange> findByProductIdAndTimeRange(Long productId, Instant startTime, Instant endTime);

    @Query("SELECT * FROM product_changes WHERE product_id = ?0 AND operation = ?1 ALLOW FILTERING")
    List<ProductChange> findByProductIdAndOperation(Long productId, String operation);

    @Query("SELECT * FROM product_changes WHERE operation = ?0 ALLOW FILTERING")
    List<ProductChange> findByOperation(String operation);

    @Query("SELECT * FROM product_changes WHERE change_timestamp >= ?0 ALLOW FILTERING")
    List<ProductChange> findRecentChanges(Instant since);
}