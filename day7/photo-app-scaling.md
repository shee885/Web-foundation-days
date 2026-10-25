# Day 7 Assignment: SnapShare Scaling Plan

## 1. Assumptions and Daily Active Users

### Assumptions

The following assumptions are based on the information provided in the assignment:

- SnapShare has 10,000,000 registered users.
- 10% of registered users are active each day.
- Each active user uploads one photo per day.
- Each active user views 50 feed pages per day.
- Each original photo has an average size of 2 MB.
- Each photo also has a thumbnail of 50 KB.
- The system operates 24 hours per day.
- Peak feed traffic is five times the average traffic.
- There are 365 days in a year.
- The number of daily active users and uploads remains constant throughout the year.

### Calculate Daily Active Users

Daily active users are the number of people who use SnapShare each day.

Daily active users = Registered users × Percentage active daily

= 10,000,000 × 10%

= 10,000,000 × 0.10

= 1,000,000 users

**Therefore, SnapShare has 1,000,000 daily active users.**

## 2. Traffic and Storage Estimates

There are 86,400 seconds in one day (24 × 60 × 60).

### Uploads Per Second

Each of the 1,000,000 daily active users uploads one photo per day.

Daily uploads = 1,000,000 × 1 = 1,000,000 photos.

Average uploads per second = 1,000,000 ÷ 86,400.

Average uploads per second ≈ 11.57.

**SnapShare receives approximately 12 photo uploads per second on average.**

### Feed Views Per Second

Each daily active user views 50 feed pages per day.

Daily feed views = 1,000,000 × 50 = 50,000,000 feed views.

Average feed views per second = 50,000,000 ÷ 86,400.

Average feed views per second ≈ 578.7.

**Average feed views per second ≈ 579.**

Peak feed views per second are estimated using a factor of five.

Peak feed views per second = 578.7 × 5 ≈ 2,894.

**Peak feed views per second ≈ 2,894.**

### Photo Storage Per Year

Each original photo is 2 MB, and each thumbnail is 50 KB.

**Original photos:**

Daily original photo storage = 1,000,000 × 2 MB = 2 TB.

Yearly original photo storage = 2 TB × 365 = 730 TB.

**Thumbnails:**

Daily thumbnail storage = 1,000,000 × 50 KB = 50 GB.

Yearly thumbnail storage = 50 GB × 365 = 18.25 TB.

**Total storage per year:**

730 TB + 18.25 TB = 748.25 TB.

SnapShare needs approximately **748.25 TB of storage per year** for original photos and thumbnails, excluding backups, replicas, and other overhead.

## 3. Read-Heavy or Write-Heavy?

SnapShare is a read-heavy system because users view 50 feed pages per day but upload only one photo per day.

The system receives approximately 50 million feed views and 1 million photo uploads daily. Feed views occur about 50 times as often as uploads.

The design should prioritize fast reading by using a CDN, Redis cache, and database read replica. These components reduce the work required from the application servers and main database when users browse their feeds.

## 4. Why Photos Should Not Be Stored Inside the Database

Photos should not be stored directly inside the main database because image files are large and would consume substantial database storage. This could increase backup sizes, storage costs, and the time required to manage the database.

Instead, original photos and thumbnails should be stored in object storage, which is designed to store and retrieve large files efficiently.

The database should store photo metadata, including the photo ID, owner's ID, caption, upload time, and the location of the photo in object storage.

This separation allows the database to manage structured information efficiently while object storage manages the actual image files.

## 5. SnapShare Architecture Diagram

```text
                         USERS
                           |
                           v
                    +-------------+
                    |     CDN     |
                    | Image Cache |
                    +-------------+
                           |
                           v
                    +-------------+
                    | Load        |
                    | Balancer    |
                    +-------------+
                           |
                 +---------+---------+
                 |         |         |
                 v         v         v
             +------+  +------+  +------+
             | App  |  | App  |  | App  |
             |Server|  |Server|  |Server|
             +------+  +------+  +------+
                 |         |         |
                 +---------+---------+
                           |
                  +--------+--------+
                  |                 |
                  v                 v
             +---------+      +-------------+
             | Redis   |      | Main        |
             | Cache   |      | Database    |
             +---------+      +-------------+
                                    |
                                    v
                              +-------------+
                              | Read Replica|
                              +-------------+


              PHOTO UPLOAD AND PROCESSING

                       App Server
                           |
                           v
                    +-------------+
                    |   Object    |
                    |   Storage   |
                    |  Original   |
                    +-------------+
                           |
                           v
                    +-------------+
                    |    Queue    |
                    | Thumbnail   |
                    |    Job      |
                    +-------------+
                           |
                           v
                    +-------------+
                    | Thumbnail   |
                    |   Worker    |
                    +-------------+
                           |
                           v
                    +-------------+
                    |   Object    |
                    |   Storage   |
                    |  Thumbnail  |
                    +-------------+
                           |
                           v
                    Update photo metadata
                      in Main Database
```

## 6. Explanation of Each Component

1. **CDN (Content Delivery Network):** Delivers photos and thumbnails to users quickly from servers closer to their locations.

2. **Load Balancer:** Distributes incoming requests across multiple application servers to prevent one server from becoming overloaded.

3. **Application Servers:** Handle user requests, process photo uploads, and communicate with the cache, database, and object storage.

4. **Redis Cache:** Temporarily stores frequently requested information so the application can respond faster without querying the database every time.

5. **Main Database:** Stores structured information such as user details, photo captions, photo IDs, and links to images in object storage.

6. **Database Read Replica:** Handles additional read requests to reduce the workload on the main database.

7. **Object Storage:** Stores the original photos and generated thumbnails separately from the main database.

8. **Queue:** Holds thumbnail-generation jobs until a worker is ready to process them.

9. **Thumbnail Worker:** Processes uploaded photos in the background to create smaller thumbnail versions.

## 7. Photo Upload Flow

When a user uploads a photo, the following steps take place:

1. **User selects a photo:** The user chooses a photo and uploads it through the SnapShare application.

2. **Request reaches the application:** The load balancer directs the upload request to an available application server.

3. **Photo is stored:** The application server saves the original photo in object storage.

4. **Metadata is saved:** The application stores information such as the photo ID, user ID, caption, and storage location in the main database.

5. **Thumbnail job is queued:** The application adds a thumbnail-generation job to the queue.

6. **Worker processes the job:** A thumbnail worker retrieves the job and creates a smaller version of the original photo.

7. **Thumbnail is stored:** The worker saves the thumbnail in object storage.

8. **Photo becomes available:** The application can now show the photo and its thumbnail in the user's feed. The CDN can help deliver the image quickly when users view it.

## 8. Design Trade-offs

### Trade-off 1: Faster Image Delivery vs. Cost

Using a CDN makes photos load faster and reduces requests to the main servers. However, using a CDN adds extra costs, especially when many photos are delivered to users.

### Trade-off 2: Caching vs. Data Freshness

Using Redis cache improves response times and reduces database workload. However, cached information can become outdated, so the application must update or invalidate the cache when information changes.

### Trade-off 3: Background Processing vs. Processing Delay

Using a queue and thumbnail worker prevents thumbnail generation from slowing down photo uploads. However, thumbnails may take a short time to become available because the worker processes jobs in the background.
