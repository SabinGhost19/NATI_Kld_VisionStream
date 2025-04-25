package com.sabinghost19.nati_kld_ml.model;


import org.springframework.data.cassandra.core.cql.PrimaryKeyType;
import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyColumn;
import org.springframework.data.cassandra.core.mapping.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Table("product_changes")
public class ProductChange {

    @PrimaryKeyColumn(name = "product_id", ordinal = 0, type = PrimaryKeyType.PARTITIONED)
    private UUID productId;

    @PrimaryKeyColumn(name = "change_timestamp", ordinal = 1, type = PrimaryKeyType.CLUSTERED)
    private Instant changeTimestamp;

    @Column("operation")
    private String operation;

    @Column("price_old")
    private BigDecimal priceOld;

    @Column("price_new")
    private BigDecimal priceNew;

    @Column("quantity_old")
    private Integer quantityOld;

    @Column("quantity_new")
    private Integer quantityNew;

    public ProductChange() {
    }

    public ProductChange(UUID productId, Instant changeTimestamp, String operation,
                         BigDecimal priceOld, BigDecimal priceNew,
                         Integer quantityOld, Integer quantityNew) {
        this.productId = productId;
        this.changeTimestamp = changeTimestamp;
        this.operation = operation;
        this.priceOld = priceOld;
        this.priceNew = priceNew;
        this.quantityOld = quantityOld;
        this.quantityNew = quantityNew;
    }

    public UUID getProductId() {
        return productId;
    }

    public void setProductId(UUID productId) {
        this.productId = productId;
    }

    public Instant getChangeTimestamp() {
        return changeTimestamp;
    }

    public void setChangeTimestamp(Instant changeTimestamp) {
        this.changeTimestamp = changeTimestamp;
    }

    public String getOperation() {
        return operation;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }

    public BigDecimal getPriceOld() {
        return priceOld;
    }

    public void setPriceOld(BigDecimal priceOld) {
        this.priceOld = priceOld;
    }

    public BigDecimal getPriceNew() {
        return priceNew;
    }

    public void setPriceNew(BigDecimal priceNew) {
        this.priceNew = priceNew;
    }

    public Integer getQuantityOld() {
        return quantityOld;
    }

    public void setQuantityOld(Integer quantityOld) {
        this.quantityOld = quantityOld;
    }

    public Integer getQuantityNew() {
        return quantityNew;
    }

    public void setQuantityNew(Integer quantityNew) {
        this.quantityNew = quantityNew;
    }

    @Override
    public String toString() {
        return "ProductChange{" +
                "productId=" + productId +
                ", changeTimestamp=" + changeTimestamp +
                ", operation='" + operation + '\'' +
                ", priceOld=" + priceOld +
                ", priceNew=" + priceNew +
                ", quantityOld=" + quantityOld +
                ", quantityNew=" + quantityNew +
                '}';
    }
}