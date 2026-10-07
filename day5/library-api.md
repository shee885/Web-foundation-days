# Library Books REST API

## 1. List all books

- **Method:** GET
- **Path:** `/books`
- **Description:** Returns a list of all books in the library.
- **Success status:** `200 OK`

## 2. Get one book

- **Method:** GET
- **Path:** `/books/{id}`
- **Description:** Returns one book using its unique ID.
- **Success status:** `200 OK`

## 3. Create a book

- **Method:** POST
- **Path:** `/books`
- **Description:** Creates a new book in the library.
- **Request body:**

  ```json
  {
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "year": 1958
  }
  ```

  ## 4. Update a book

- **Method:** PUT
- **Path:** `/books/{id}`
- **Description:** Updates an existing book using its unique ID.
- **Request body:**

  ```json
  {
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "year": 1958
  }
  ```

  ## 5. Delete a book

- **Method:** DELETE
- **Path:** `/books/{id}`
- **Description:** Deletes a book using its unique ID.
- **Success status:** `204 No Content`

## 6. List books by author

- **Method:** GET
- **Path:** `/books?author=Chinua%20Achebe`
- **Description:** Returns books written by the specified author.
- **Success status:** `200 OK`

## Error codes

- **400 Bad Request:** The request is invalid or missing required information. Example: trying to create a book without a title or author.
- **404 Not Found:** The requested resource does not exist. Example: trying to get `GET /books/9999` when book `9999` does not exist.
