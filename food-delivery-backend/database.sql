
CREATE DATABASE food_delivery_db;

USE food_delivery_db;

-- Users Table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    user_type ENUM('customer', 'restaurant_owner', 'delivery_personnel','admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Restaurants (
    restaurant_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT,
    name VARCHAR(255) NOT NULL,
    location TEXT,
    cuisine_type VARCHAR(100),
    rating DECIMAL(2,1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image_url VARCHAR(255),
    FOREIGN KEY (owner_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Menu (
    menu_id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    image_url VARCHAR(255),  
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE
);

-- Orders Table
CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    restaurant_id INT,
    status ENUM('placed', 'preparing', 'out for delivery', 'delivered') NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    placed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE
);

-- Order_Items Table
CREATE TABLE Order_Items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    menu_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES Menu(menu_id) ON DELETE CASCADE
);

-- Delivery_Personnel Table
CREATE TABLE Delivery_Personnel (
    delivery_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    vehicle_type VARCHAR(50),
    current_location TEXT,
    availability BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Reviews Table
CREATE TABLE Reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT,
    user_id INT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Review_Photos Table
CREATE TABLE Review_Photos (
    photo_id INT AUTO_INCREMENT PRIMARY KEY,
    review_id INT,
    photo_url VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES Reviews(review_id) ON DELETE CASCADE
);

CREATE TABLE Customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    preferred_cuisine VARCHAR(100),
    default_delivery_address TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Cart (
    cart_id INT NOT NULL AUTO_INCREMENT,
    menu_id INT,
    user_id INT,
    quantity INT DEFAULT 1,
    PRIMARY KEY (cart_id),
    FOREIGN KEY (menu_id) REFERENCES Menu(menu_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE user_count (
    user_id INT NOT NULL PRIMARY KEY,
    order_count INT DEFAULT 0
);

DELIMITER //

CREATE TRIGGER update_user_order_count
AFTER INSERT ON Orders
FOR EACH ROW
BEGIN
 
  IF EXISTS (SELECT 1 FROM user_count WHERE user_id = NEW.user_id) THEN
    
    UPDATE user_count
    SET order_count = order_count + 1
    WHERE user_id = NEW.user_id;
  ELSE
   
    INSERT INTO user_count (user_id, order_count)
    VALUES (NEW.user_id, 1);
  END IF;
END //

DELIMITER ;