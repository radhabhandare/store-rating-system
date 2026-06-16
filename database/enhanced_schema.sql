DROP DATABASE IF EXISTS store_rating_system;
CREATE DATABASE store_rating_system;
USE store_rating_system;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(400),
    phone VARCHAR(20),
    role ENUM('admin', 'user', 'owner') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address VARCHAR(400) NOT NULL,
    phone VARCHAR(20),
    category VARCHAR(50),
    description TEXT,
    owner_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE ratings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    rating INT NOT NULL,
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_store (user_id, store_id),
    CHECK (rating >= 1 AND rating <= 5)
);

CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    icon VARCHAR(10)
);

INSERT INTO categories (name, icon) VALUES
('Grocery', '🛒'), ('Electronics', '📱'), ('Fashion', '👕'), 
('Restaurant', '🍔'), ('Coffee Shop', '☕'), ('Bookstore', '📚');

INSERT INTO users (name, email, password, address, role) VALUES
('System Admin', 'admin@example.com', 'Admin@123', '123 Admin St', 'admin'),
('John User', 'john@example.com', 'Test@123', '456 User Ave', 'user'),
('Mike Owner', 'mike@example.com', 'Test@123', '321 Owner Blvd', 'owner');

INSERT INTO stores (name, email, address, category, owner_id) VALUES
('Walmart', 'walmart@test.com', '123 Main St', 'Grocery', NULL),
('Target', 'target@test.com', '456 Oak Ave', 'Grocery', NULL),
('Best Buy', 'bestbuy@test.com', '789 Tech Rd', 'Electronics', 3);

INSERT INTO ratings (user_id, store_id, rating) VALUES
(2, 1, 4), (2, 2, 5), (2, 3, 4);

SELECT 'Database setup complete!' as Status;