DROP DATABASE IF EXISTS store_rating_system;
CREATE DATABASE store_rating_system;
USE store_rating_system;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(400),
    role ENUM('admin', 'user', 'owner') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE stores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address VARCHAR(400) NOT NULL,
    owner_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE ratings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    rating INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_store (user_id, store_id),
    CONSTRAINT chk_rating CHECK (rating >= 1 AND rating <= 5)
);

INSERT INTO users (name, email, password, address, role) VALUES
('Admin User Administrator', 'admin@example.com', 'Admin@123', '123 Admin Street, New York, NY 10001', 'admin'),
('John Doe Regular User', 'john@example.com', 'Test@123', '456 User Avenue, Los Angeles, CA 90001', 'user'),
('Jane Smith Regular User', 'jane@example.com', 'Test@123', '789 User Road, Chicago, IL 60601', 'user'),
('Mike Johnson Store Owner', 'mike@example.com', 'Test@123', '321 Owner Boulevard, Houston, TX 77001', 'owner'),
('Sarah Williams Store Owner', 'sarah@example.com', 'Test@123', '654 Owner Lane, Phoenix, AZ 85001', 'owner');

INSERT INTO stores (name, email, address, owner_id) VALUES
('Walmart Supercenter', 'contact@walmart.com', '2100 Richard Arrington Jr Blvd N, Birmingham, AL 35203', NULL),
('Target Store', 'guest.services@target.com', '1000 Nicollet Mall, Minneapolis, MN 55403', NULL),
('Whole Foods Market', 'support@wholefoods.com', '525 N Lamar Blvd, Austin, TX 78703', 4),
('Best Buy', 'customer.care@bestbuy.com', '7601 Penn Ave S, Richfield, MN 55423', NULL),
('Starbucks Coffee', 'customer.service@starbucks.com', '2401 Utah Ave S, Seattle, WA 98134', 4),
("McDonald's", 'contact@mcdonalds.com', '110 N Carpenter St, Chicago, IL 60607', NULL),
('Zara USA', 'info@zara.com', '500 5th Ave, New York, NY 10110', 5),
('Barnes & Noble', 'customercare@barnesandnoble.com', '122 5th Ave, New York, NY 10011', NULL),
('Home Depot', 'customer.service@homedepot.com', '2455 Paces Ferry Rd SE, Atlanta, GA 30339', NULL);

INSERT INTO ratings (user_id, store_id, rating) VALUES
(2, 1, 4),
(2, 2, 5),
(2, 3, 4),
(2, 4, 5),
(2, 5, 5),
(3, 1, 3),
(3, 2, 4),
(3, 3, 5),
(3, 6, 4),
(3, 7, 5),
(4, 1, 5),
(4, 2, 4),
(4, 4, 5),
(5, 3, 5),
(5, 5, 4),
(5, 7, 5);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_stores_name ON stores(name);
CREATE INDEX idx_ratings_store ON ratings(store_id);