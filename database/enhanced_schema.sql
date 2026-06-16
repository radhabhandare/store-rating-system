-- Professional Database Schema
DROP DATABASE IF EXISTS store_rating_system;
CREATE DATABASE store_rating_system;
USE store_rating_system;

-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(400),
    phone VARCHAR(20),
    avatar VARCHAR(255),
    role ENUM('admin', 'user', 'owner') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_name_length CHECK (CHAR_LENGTH(name) >= 20 AND CHAR_LENGTH(name) <= 60),
    CONSTRAINT chk_address_length CHECK (CHAR_LENGTH(address) <= 400)
);

-- Stores Table
CREATE TABLE stores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address VARCHAR(400) NOT NULL,
    phone VARCHAR(20),
    website VARCHAR(255),
    description TEXT,
    category VARCHAR(50),
    image VARCHAR(255),
    banner VARCHAR(255),
    owner_id INT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    opening_time TIME,
    closing_time TIME,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_store_address_length CHECK (CHAR_LENGTH(address) <= 400)
);

-- Ratings Table
CREATE TABLE ratings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    rating INT NOT NULL,
    review TEXT,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_store (user_id, store_id),
    CONSTRAINT chk_rating_range CHECK (rating >= 1 AND rating <= 5)
);

-- Activity Log Table
CREATE TABLE activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    action VARCHAR(50) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Categories Table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    icon VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_name ON users(name);
CREATE INDEX idx_stores_name ON stores(name);
CREATE INDEX idx_stores_category ON stores(category);
CREATE INDEX idx_ratings_store ON ratings(store_id);
CREATE INDEX idx_ratings_user ON ratings(user_id);
CREATE INDEX idx_activities_user ON activities(user_id);
CREATE INDEX idx_activities_created ON activities(created_at);

-- Sample Data
INSERT INTO categories (name, icon, description) VALUES
('Grocery', '🛒', 'Supermarkets and grocery stores'),
('Electronics', '📱', 'Electronic devices and accessories'),
('Fashion', '👕', 'Clothing and accessories stores'),
('Restaurant', '🍔', 'Dining and fast food'),
('Coffee Shop', '☕', 'Cafes and coffee houses'),
('Bookstore', '📚', 'Book shops and libraries'),
('Pharmacy', '💊', 'Pharmacies and drug stores'),
('Fitness', '💪', 'Gyms and fitness centers'),
('Home Decor', '🏠', 'Home improvement and decor'),
('Pet Store', '🐕', 'Pet supplies and services');

INSERT INTO users (name, email, password, address, phone, role) VALUES
('System Administrator', 'admin@example.com', 'Admin@123', '123 Admin Street, New York, NY 10001', '+1234567890', 'admin'),
('John Doe Regular User', 'john@example.com', 'Test@123', '456 User Avenue, Los Angeles, CA 90001', '+1987654321', 'user'),
('Jane Smith Regular User', 'jane@example.com', 'Test@123', '789 User Road, Chicago, IL 60601', '+1122334455', 'user'),
('Mike Johnson Store Owner', 'mike@example.com', 'Test@123', '321 Owner Boulevard, Houston, TX 77001', '+1555666777', 'owner'),
('Sarah Williams Store Owner', 'sarah@example.com', 'Test@123', '654 Owner Lane, Phoenix, AZ 85001', '+1999888777', 'owner'),
('Robert Brown Store Owner', 'robert@example.com', 'Test@123', '987 Owner Drive, Philadelphia, PA 19101', '+1777888999', 'owner');

INSERT INTO stores (name, email, address, phone, category, description, owner_id, latitude, longitude) VALUES
('Walmart Supercenter', 'contact@walmart.com', '2100 Richard Arrington Jr Blvd N, Birmingham, AL 35203', '+12055551234', 'Grocery', 'One-stop shop for everything from groceries to electronics', NULL, 33.5186, -86.8104),
('Target Store', 'guest.services@target.com', '1000 Nicollet Mall, Minneapolis, MN 55403', '+16126784433', 'Grocery', 'Affordable quality products for everyday needs', NULL, 44.9778, -93.2650),
('Whole Foods Market', 'support@wholefoods.com', '525 N Lamar Blvd, Austin, TX 78703', '+15124781234', 'Grocery', 'Natural and organic products', 4, 30.2672, -97.7431),
('Best Buy', 'customer.care@bestbuy.com', '7601 Penn Ave S, Richfield, MN 55423', '+19523698100', 'Electronics', 'Technology products and services', NULL, 44.8770, -93.2827),
('Starbucks Coffee', 'customer.service@starbucks.com', '2401 Utah Ave S, Seattle, WA 98134', '+12063181575', 'Coffee Shop', 'Premium coffee and beverages', 4, 47.5809, -122.3339),
('Zara USA', 'info@zara.com', '500 5th Ave, New York, NY 10110', '+12127303260', 'Fashion', 'Latest fashion trends', 5, 40.7539, -73.9808),
('Barnes & Noble', 'customercare@barnesandnoble.com', '122 5th Ave, New York, NY 10011', '+12126333900', 'Bookstore', 'Books, music, and more', NULL, 40.7373, -73.9928);

INSERT INTO ratings (user_id, store_id, rating, review) VALUES
(2, 1, 4, 'Great selection and good prices. Clean and organized store.'),
(2, 2, 5, 'Excellent customer service! Very organized and helpful staff.'),
(3, 1, 3, 'Average experience. Could have better variety.'),
(3, 2, 4, 'Nice store, good variety of products.'),
(4, 1, 5, 'Best grocery store in town! Highly recommended.'),
(4, 5, 4, 'Best coffee in Seattle! Great atmosphere.'),
(5, 3, 5, 'Love the organic section! Very fresh produce.'),
(6, 1, 4, 'Good value for money. Friendly staff.');

INSERT INTO activities (user_id, action, details, ip_address) VALUES
(1, 'LOGIN', 'Admin logged in successfully', '192.168.1.1'),
(2, 'REGISTER', 'New user registered', '192.168.1.2'),
(3, 'RATE', 'Rated Walmart with 3 stars', '192.168.1.3'),
(4, 'RATE', 'Rated Target with 4 stars', '192.168.1.4');

SELECT 'Database setup complete!' as Status;
SELECT 'Admin Login: admin@example.com / Admin@123' as Admin_Credentials;
SELECT 'User Login: john@example.com / Test@123' as User_Credentials;
SELECT 'Owner Login: mike@example.com / Test@123' as Owner_Credentials;