### 4.3 Preventing Double-Booking

TicketHub must guarantee that the same seat cannot be sold to two different customers.

When a customer requests a seat, the application starts a database transaction and attempts to change the seat status from Available to Held. This update succeeds only if the seat is still available or its previous hold has expired.

For example, the database can perform an operation similar to this:

```sql
UPDATE seats
SET status = 'Held',
    hold_expires_at = CURRENT_TIMESTAMP + INTERVAL '5 minutes'
WHERE seat_id = 501
  AND (
    status = 'Available'
    OR (
      status = 'Held'
      AND hold_expires_at <= CURRENT_TIMESTAMP
    )
  );
```

The application checks how many rows were updated. If one row was updated, the hold succeeded. If zero rows were updated, another customer may already hold or have purchased the seat, so the application returns `409 Conflict`.

Database transactions and atomic updates ensure that competing requests cannot both successfully claim the same seat. The unique constraint on `tickets.seat_id` provides an additional safeguard against issuing multiple tickets for one seat.

When payment succeeds, the system verifies the payment, confirms the order, marks the seat as Sold, and issues the ticket. These database changes must be handled safely so that the booking records remain consistent.

If a hold expires without a completed purchase, the seat becomes available again. A background process can identify expired holds, while each new booking request also checks whether a hold has expired.

The database, rather than the browser or cache, is the final authority on seat availability.

## 5. System Architecture

### 5.1 Architecture Diagram

```text
                    Customers
                        |
                        v
                 CDN / Web Frontend
                        |
                        v
                Waiting Room / Queue
                        |
                        v
                  Load Balancer
                        |
             +----------+----------+
             |          |          |
             v          v          v
          App Server App Server App Server
             |          |          |
             +----------+----------+
                        |
          +-------------+-------------+
          |             |             |
          v             v             v
      Redis Cache   Primary DB   Payment Provider
                        |
                        v
                   Read Replica

              Background Workers
                        |
                        v
                  Primary Database
```

### 5.2 Component Explanations

1. **Customers:** Use the website to browse events, select seats, and purchase tickets.

2. **CDN and Web Frontend:** Deliver website content efficiently and provide the interface customers use to interact with TicketHub.

3. **Waiting Room:** Controls how many customers enter the booking system at once during popular sales, reducing pressure on the application and database.

4. **Load Balancer:** Distributes incoming requests across healthy application servers and redirects traffic away from unhealthy servers.

5. **Application Servers:** Handle user requests, validate bookings, manage orders, and communicate with the database and payment provider. Multiple servers allow TicketHub to handle more users.

6. **Redis Cache:** Stores frequently requested information, such as event details, to reduce database workload. Cached seat information is only for display and must not determine whether a booking succeeds.

7. **Primary Database:** Stores users, events, seats, orders, and tickets. It is the main source of truth for seat availability and booking decisions. Transactions and constraints protect the booking process.

8. **Read Replica:** Handles suitable read-only queries, such as browsing event information, to reduce the workload on the primary database. Booking decisions must use the primary database.

9. **Payment Provider:** Processes payments securely and sends payment confirmations that the application verifies before completing a purchase.

10. **Background Workers:** Process tasks such as identifying expired seat holds and sending booking notifications. They communicate with the primary database and relevant task queues.

### 5.3 Handling a Popular Concert Sale

When 200,000 people attempt to purchase 20,000 tickets, the waiting room controls how quickly customers enter the booking system. The load balancer distributes requests across application servers, while caching reduces repeated database queries.

The primary database processes seat holds and purchases using atomic updates, transactions, and constraints to prevent double-booking. Payment confirmations are verified before tickets are issued.

Monitoring, health checks, backups, and recovery procedures help the system detect problems and restore service after failures.

## 6. Trade-Offs

### 6.1 Waiting Room Versus Immediate Access

A waiting room protects the application and database from sudden traffic spikes and helps organize access to tickets. However, customers may have to wait before entering the website. TicketHub must use a transparent queue policy and communicate waiting information clearly.

### 6.2 Caching Versus Data Freshness

Caching event details improves response times and reduces database load. However, cached information can become outdated. TicketHub can cache relatively stable event information, but seat availability and booking decisions must be checked against the primary database.

### 6.3 Consistency Versus Performance

Database transactions and constraints protect customers from double-booking. However, competing seat reservations may have to wait for database operations to complete, reducing throughput during a popular sale. TicketHub prioritizes correct bookings over accepting conflicting reservations.

### 6.4 More Servers Versus Cost

Adding application servers improves capacity and resilience but increases infrastructure and maintenance costs. TicketHub can scale the number of servers according to demand rather than running every server at maximum capacity all the time.
