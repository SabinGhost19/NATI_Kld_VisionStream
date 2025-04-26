# NATI_Kld_VisionStream

## What I've Built So Far

I've developed a Spring Boot backend that handles insertion, updates, retrieval, and other operations. This serves as the main backend that interfaces with a Cassandra database cluster.

I've tested the system with the following data models (shown in TypeScript for simplicity, but implemented in Java as well):

```typescript
export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  category: string | null;
}

export interface ProductChange {
  id?: string;
  productId: string;
  timestamp: string;
  changeType: string;
  oldValue: string;
  newValue: string;
}
```

Currently, I'm inserting and retrieving this type of data from Cassandra. While Cassandra excels at data insertion (approximately 100x faster than other databases) and performs well with simple queries, it's not optimized for complex queries, joins, or filtering. This is why we need a relational database like PostgreSQL.

## Proposed Data Structure Changes

I need to modify the data stored in Cassandra to use an event-oriented format:

```json
{
  "event_id": "550e8400-e29b-41d4-a716-446655440000",
  "product_id": "a3d2f4r5-67f9-4a2b-a0c1-123456789abc",
  "event_type": "PRODUCT_CREATED",
  "event_data": {
    "name": "Smartphone XYZ",
    "price": 499.99,
    "category_id": "tech-123",
    "quantity": 1000
  },
  "timestamp": "2025-04-26T15:30:00Z"
}
```

This positions Cassandra as an event logger (for product creation and updates), which is ideal since we'll be inserting approximately 50,000 records per second (500,000 records every 10 seconds).

## System Architecture

![System Architecture](./image.png)

We'll use PostgreSQL for complex queries: we'll retrieve data from PostgreSQL (even if it's a few seconds or milliseconds out of date) and serve it to the ML backend that compares prices and quantities.

The system flow will work as follows:

1. Data enters the main Spring Boot backend
2. Data is sent to Cassandra
3. A secondary backend listens for these entries, retrieves them, and immediately inserts them into PostgreSQL after Cassandra insertion is complete

This approach leverages Cassandra's strengths (high-speed insertion, fault tolerance, and scalability) while addressing PostgreSQL's limitations with long-term persistence and fault tolerance.

## Next Steps

### For GABONE:

You should research Kafka - what it is, how it's used, and its benefits. Specifically, look into how Kafka is used in Python, as when there are new product updates (resulting from ML processing), you'll need to send messages to a queue that my main Spring Boot backend will consume and use to update the databases.

Additionally, explore ML for object detection in images. Images will be processed to generate tags, and these tags will be sent to another Python-based AI service that will:

1. Compare the received tags and object frequency (from the image detection AI service) from the large image buffer
2. Cross-reference with existing data in the PostgreSQL database

When it identifies a matching product name (not necessarily an exact match), it will modify the price and send the update (the new product with its ID) through Kafka to the backend for database updates.
