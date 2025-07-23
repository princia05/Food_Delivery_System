const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: '', //your username
    password: '', //your password
    database: 'food_delivery_db'
});

// Login 
app.post('/login', (req, res) => {
    const { email, password, user_type } = req.body;

    if (!user_type) {
        return res.status(400).json({ Status: "Error", Error: "User type is required" });
    }

    let sql = '';
    // select the SQL query based on user_type
    switch (user_type) {
        case 'restaurant_owner':
            sql = `
                SELECT u.*, r.* 
                FROM Users u 
                LEFT JOIN Restaurants r ON u.user_id = r.owner_id 
                WHERE u.email = ? 
                AND u.password = ? 
                AND u.user_type = 'restaurant_owner'
            `;
            break;
        case 'customer':
            sql = `
                SELECT u.*, c.* 
                FROM Users u 
                LEFT JOIN Customers c ON u.user_id = c.user_id 
                WHERE u.email = ? 
                AND u.password = ? 
                AND u.user_type = 'customer'
            `;
            break;
        case 'delivery_personnel':
            sql = `
                SELECT u.*, d.* 
                FROM Users u 
                LEFT JOIN Delivery_Personnel d ON u.user_id = d.user_id 
                WHERE u.email = ? 
                AND u.password = ? 
                AND u.user_type = 'delivery_personnel'
            `;
            break;
        case 'admin':
            sql = `
                SELECT * 
                FROM Users 
                WHERE email = ? 
                AND password = ? 
                AND user_type = 'admin'
            `;
            break;
        default:
            return res.status(400).json({ Status: "Error", Error: "Invalid user type" });
    }

    // Query the database based on selected user_type
    db.query(sql, [email, password], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ Status: "Error", Error: "Error in running query" });
        }

        if (result.length > 0) {
            const user = result[0];
            
            let response = {
                Status: "Success",
                user_type: user.user_type,
                userId: user.user_id,
            };

            if (user_type === 'restaurant_owner') {
                response.restaurantId = user.restaurant_id;
                response.name = user.name;
                response.location = user.location;
                response.cuisine_type = user.cuisine_type;
                response.rating = user.rating;
                response.image_url = user.image_url;
            } else if (user_type === 'customer') {
                response.customerId = user.customer_id;
                response.preferredCuisine = user.preferred_cuisine;
                response.defaultDeliveryAddress = user.default_delivery_address;
            } else if (user_type === 'delivery_personnel') {
                response.deliveryPersonId = user.delivery_personnel_id;
                response.vehicle_type = user.vehicle_type;
                response.delivery_area = user.delivery_area;
            } else if (user_type === 'admin') {
                response.isAdmin = true; 
            }

            return res.json(response);
        } else {
            return res.status(401).json({ Status: "Error", Error: "Invalid credentials or incorrect user type" });
        }
    });
});


// Signup 
app.post('/signup', (req, res) => {
    const { email, password, phone, user_type, additional_info } = req.body;

    // Insert user into Users table
    let sql = `INSERT INTO Users (email, password, phone, user_type) VALUES (?, ?, ?, ?)`;
    db.query(sql, [email, password, phone, user_type], (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ Status: "Error", Error: "Error inserting user into Users table" });
        }

        const userId = result.insertId; 

        // Insert user-specific data into the appropriate table
        if (user_type === 'customer') {
            const { preferredCuisine, defaultDeliveryAddress } = additional_info;
            sql = `INSERT INTO Customers (user_id, preferred_cuisine, default_delivery_address) VALUES (?, ?, ?)`;
            db.query(sql, [userId, preferredCuisine, defaultDeliveryAddress], (err, result) => {
                if (err) {
                    console.error('Error inserting customer:', err);
                    return res.status(500).json({ Status: "Error", Error: "Error inserting customer into Customers table" });
                }

                return res.status(200).json({ Status: "Success", Message: "Signup successful!" });
            });
        } else if (user_type === 'restaurant_owner') {
            const { name, location, cuisine_type, rating, image_url } = additional_info;
            sql = `INSERT INTO Restaurants (owner_id, name, location, cuisine_type, rating, image_url) VALUES (?, ?, ?, ?, ?, ?)`;
            db.query(sql, [userId, name, location, cuisine_type, rating, image_url], (err, result) => {
                if (err) {
                    console.error('Error inserting restaurant:', err);
                    return res.status(500).json({ Status: "Error", Error: "Error inserting restaurant into Restaurants table" });
                }

                return res.status(200).json({ Status: "Success", Message: "Signup successful!" });
            });
        } else if (user_type === 'delivery_personnel') {
            const { vehicle_type, delivery_area } = additional_info;
            sql = `INSERT INTO Delivery_Personnel (user_id, vehicle_type, current_location) VALUES (?, ?, ?)`;
            db.query(sql, [userId, vehicle_type, delivery_area], (err, result) => {
                if (err) {
                    console.error('Error inserting delivery personnel:', err);
                    return res.status(500).json({ Status: "Error", Error: "Error inserting delivery personnel into DeliveryPersonnel table" });
                }

                return res.status(200).json({ Status: "Success", Message: "Signup successful!" });
            });
        } else {
            return res.status(400).json({ Status: "Error", Error: "Invalid user type" });
        }
    });
});

//  fetch the list of restaurants
app.get('/restaurants', (req, res) => {
   
    const sql = `SELECT * FROM Restaurants`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching restaurants:', err);
            return res.status(500).json({ Status: "Error", Error: "Error fetching restaurants" });
        }

        // If restaurants exist
        if (result.length > 0) {
            return res.json(result);
        } else {
            return res.status(404).json({ Status: "Error", Error: "No restaurants found" });
        }
    });
});

app.get('/restaurant/:restaurantId/menu', (req, res) => {
    const { restaurantId } = req.params;
    console.log("Restaurant ID:", restaurantId); // Log the restaurantId
    const sql = 'SELECT * FROM Menu WHERE restaurant_id = ?';
    db.query(sql, [restaurantId], (err, results) => {
        if (err) {
            console.error("Error fetching menu items:", err);
            return res.status(500).json({ Status: "Error", Error: "Error fetching menu items" });
        }
        console.log("Menu items found:", results); // Log the result
        return res.status(200).json(results);
    });
});


const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: './uploads/menu-items/',
    filename: (req, file, cb) => {
        cb(null, `menu-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Images only! (jpeg, jpg, png, webp)');
        }
    }
});

//add to menu
app.post('/restaurant/:restaurantId/menu', async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const { itemName, description, price, category, image_url } = req.body;

        // Check if required parameters are present
        if (!itemName || price === undefined || price === null) {
            return res.status(400).json({ Status: "Error", Error: "Missing required parameters" });
        }

        // Check if restaurant ID is a valid number
        if (isNaN(parseInt(restaurantId))) {
            return res.status(400).json({ Status: "Error", Error: "Invalid restaurant ID" });
        }

        // Check if price is a valid number
        if (isNaN(parseFloat(price))) {
            return res.status(400).json({ Status: "Error", Error: "Invalid price value" });
        }

        const sql = 'INSERT INTO Menu (restaurant_id, item_name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?, ?)';
        
        db.query(sql, [parseInt(restaurantId), itemName, description, parseFloat(price), category, image_url], (err, result) => {
            if (err) {
                console.error("Error adding menu item:", err);
                return res.status(500).json({ Status: "Error", Error: "Error adding menu item" });
            }
            return res.status(201).json({ 
                Status: "Success", 
                Message: "Menu item added successfully!",
                imagePath: image_url 
            });
        });
    } catch (error) {
        console.error("Error in POST /menu:", error);
        return res.status(500).json({ Status: "Error", Error: "Internal server error" });
    }
});


// PUT to update a menu item by menu ID
app.put('/menu/:menuId', upload.single('image'), async (req, res) => {
    try {
        const { menuId } = req.params;
        if (!menuId) {
            return res.status(400).json({ Status: "Error", Error: "Menu ID is required" });
        }

        const { itemName, description, price, category } = req.body;
        if (!itemName || !description || !price || !category) {
            return res.status(400).json({ Status: "Error", Error: "All fields are required" });
        }

        // Fetch existing image URL for the menu item
        const getImageSql = 'SELECT image_url FROM Menu WHERE menu_id = ?';
        db.query(getImageSql, [menuId], async (err, results) => {
            if (err) {
                console.error("Error retrieving existing menu item:", err);
                return res.status(500).json({ Status: "Error", Error: "Failed to retrieve menu item for updating" });
            }

            const oldImagePath = results[0]?.image_url;
            const newImagePath = req.file ? `/uploads/menu-items/${req.file.filename}` : oldImagePath;

            const updateSql = `
                UPDATE Menu 
                SET item_name = ?, description = ?, price = ?, category = ?, image_url = ? 
                WHERE menu_id = ?
            `;
            db.query(updateSql, [itemName, description, price, category, newImagePath, menuId], async (err, result) => {
                if (err) {
                    console.error("Error updating menu item:", err);
                    // Remove newly uploaded image if the update fails
                    if (req.file) {
                        await fs.unlink(`.${newImagePath}`).catch(err => console.error('Error deleting new file:', err));
                    }
                    return res.status(500).json({ Status: "Error", Error: "Failed to update menu item" });
                }

                // Delete old image if a new image was uploaded and there was an old image
                if (req.file && oldImagePath && oldImagePath !== newImagePath) {
                    await fs.unlink(`.${oldImagePath}`).catch(err => console.error('Error deleting old image file:', err));
                }

                return res.status(200).json({ 
                    Status: "Success", 
                    Message: "Menu item updated successfully!",
                    imagePath: newImagePath
                });
            });
        });
    } catch (error) {
        console.error("Error in PUT /menu:", error);
        return res.status(500).json({ Status: "Error", Error: "Internal server error" });
    }
});

// DELETE a menu item by restaurantId and menuId
app.delete('/restaurant/:restaurantId/menu/:menuId', async (req, res) => {
    const { restaurantId, menuId } = req.params;  // Get both restaurantId and menuId from URL params

    try {
        const getImageSql = 'SELECT image_url FROM Menu WHERE menu_id = ? AND restaurant_id = ?';  // Make sure to check for restaurant_id too
        db.query(getImageSql, [menuId, restaurantId], async (err, results) => {
            if (err) {
                console.error("Error getting menu item:", err);
                return res.status(500).json({ Status: "Error", Error: "Error deleting menu item" });
            }

            const imagePath = results[0]?.image_url;

            const deleteSql = 'DELETE FROM Menu WHERE menu_id = ? AND restaurant_id = ?';  // Ensure that the restaurantId matches
            db.query(deleteSql, [menuId, restaurantId], async (err, result) => {
                if (err) {
                    console.error("Error deleting menu item:", err);
                    return res.status(500).json({ Status: "Error", Error: "Error deleting menu item" });
                }

                // Delete associated image file if it exists
                if (imagePath) {
                    await fs.unlink(`.${imagePath}`).catch(err => console.error('Error deleting file:', err));
                }

                return res.status(200).json({ Status: "Success", Message: "Menu item deleted successfully!" });
            });
        });
    } catch (error) {
        console.error("Error in DELETE /menu:", error);
        return res.status(500).json({ Status: "Error", Error: "Internal server error" });
    }
});

// Get menu items for a specific restaurant
app.get('/restaurants/:restaurantId/menu', (req, res) => {
    const { restaurantId } = req.params;
    
    console.log("ID is",restaurantId)


    const sql = `
      SELECT menu_id, restaurant_id, item_name, description, 
             price, category, image_url
      FROM Menu 
      WHERE restaurant_id = ?
      ORDER BY category, item_name
    `;
    
    db.query(sql, [restaurantId], (err, results) => {
      if (err) {
        console.error('Error fetching menu items:', err);
        return res.status(500).json({ Status: "Error", Error: "Error fetching menu items" });
      }
      
      if (results.length === 0) {
        console.log('No menu items found for restaurantId:', restaurantId);  // Log when no items found
        return res.status(200).json([]);  // Return empty array if no menu items found
      }
      
      console.log('Menu items fetched:', results);  // Log the fetched menu items
      return res.json(results);
    });
});

//add to cart
app.post('/cart/:userId', (req, res) => {
    const { userId } = req.params;
    const { menuId, quantity } = req.body;
  
    if (!menuId || !quantity || !userId) {
      return res.status(400).json({ error: 'Invalid request parameters' });
    }
  
    // Check if the item already exists in the user's cart
    const checkQuery = 'SELECT * FROM Cart WHERE user_id = ? AND menu_id = ?';
    db.query(checkQuery, [userId, menuId], (err, existingItem) => {
      if (err) {
        console.error('Error checking cart for existing item:', err);
        return res.status(500).json({ error: 'Failed to check cart' });
      }
  
      if (existingItem.length > 0) {
        
        const newQuantity = existingItem[0].quantity + quantity;
        const updateQuery = 'UPDATE Cart SET quantity = ? WHERE user_id = ? AND menu_id = ?';
        db.query(updateQuery, [newQuantity, userId, menuId], (err, result) => {
          if (err) {
            console.error('Error updating cart:', err);
            return res.status(500).json({ error: 'Failed to update cart' });
          }
  
          // If update is successful
          res.status(200).json({ message: 'Item quantity updated in cart' });
        });
      } else {
        // If the item does not exist, insert it into the cart
        const insertQuery = 'INSERT INTO Cart (menu_id, user_id, quantity) VALUES (?, ?, ?)';
        db.query(insertQuery, [menuId, userId, quantity], (err, result) => {
          if (err) {
            console.error('Error adding item to cart:', err);
            return res.status(500).json({ error: 'Failed to add item to cart' });
          }
  
          // If insert is successful
          res.status(201).json({ message: 'Item added to cart' });
        });
      }
    });
  });

  app.get('/cart/:userId', (req, res) => {
    const { userId } = req.params;

    // nested subqueries to get item details
    const query = `
        SELECT c.cart_id, c.quantity, 
            (SELECT item_name FROM Menu WHERE menu_id = c.menu_id) AS item_name,
            (SELECT description FROM Menu WHERE menu_id = c.menu_id) AS description,
            (SELECT price FROM Menu WHERE menu_id = c.menu_id) AS price
        FROM Cart c
        WHERE c.user_id = ?
    `;

    // Execute the query
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching cart items:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Cart is empty for this user' });
        }

        // Return the cart items
        res.json({ items: results });
    });
});

// Checkout
app.post('/checkout/:userId', (req, res) => {
    const userId = req.params.userId;
  
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
  
    // Step 1: Retrieve cart items for the user and calculate the total price using SUM()
    const getCartQuery = `
      SELECT c.cart_id, c.quantity, m.menu_id, m.item_name, m.price, (m.price * c.quantity) AS item_total
      FROM Cart c
      JOIN Menu m ON c.menu_id = m.menu_id
      WHERE c.user_id = ?
    `;
    
    db.query(getCartQuery, [userId], (err, cartItems) => {
      if (err) {
        console.error('Error fetching cart items:', err);
        return res.status(500).json({ message: 'Error fetching cart items' });
      }
      
      if (cartItems.length === 0) {
        return res.status(400).json({ message: 'Your cart is empty' });
      }
  
      // Calculate the total price using SUM() 
      const getTotalPriceQuery = `
        SELECT SUM(m.price * c.quantity) AS total_price
        FROM Cart c
        JOIN Menu m ON c.menu_id = m.menu_id
        WHERE c.user_id = ?
      `;
      
      db.query(getTotalPriceQuery, [userId], (err, totalPriceResult) => {
        if (err) {
          console.error('Error calculating total price:', err);
          return res.status(500).json({ message: 'Error calculating total price' });
        }
  
        const totalPrice = totalPriceResult[0].total_price;
  
        // Step 3: Insert the new order into the Orders table
        const insertOrderQuery = `
          INSERT INTO Orders (user_id, restaurant_id, status, total_price)
          VALUES (?, ?, 'placed', ?)
        `;
        
        const restaurantId = cartItems[0].restaurant_id; // Adjust as necessary
        
        db.query(insertOrderQuery, [userId, restaurantId, totalPrice], (err, result) => {
          if (err) {
            console.error('Error inserting order:', err);
            return res.status(500).json({ message: 'Error placing order' });
          }
          
          const orderId = result.insertId;
  
          // Step 4: Insert each cart item into the Order_Items table
          const insertOrderItemsQuery = `
            INSERT INTO Order_Items (order_id, menu_id, quantity, price)
            VALUES (?, ?, ?, ?)
          `;
          
          cartItems.forEach((item) => {
            db.query(insertOrderItemsQuery, [orderId, item.menu_id, item.quantity, item.price], (err) => {
              if (err) {
                console.error('Error inserting order item:', err);
                return res.status(500).json({ message: 'Error processing order items' });
              }
            });
          });
  
          //Remove the cart items for the user
          const deleteCartQuery = `DELETE FROM Cart WHERE user_id = ?`;
          db.query(deleteCartQuery, [userId], (err) => {
            if (err) {
              console.error('Error clearing cart:', err);
              return res.status(500).json({ message: 'Error clearing cart' });
            }
  
            res.json({ message: 'Order placed successfully!' });
          });
        });
      });
    });
  });
  
  

  db.query(`DROP PROCEDURE IF EXISTS sp_get_user_orders`, (err) => {
    if (err) {
        console.error('Error dropping sp_get_user_orders procedure:', err);
    } else {
        db.query(`
            CREATE PROCEDURE sp_get_user_orders(
                IN p_user_id INT
            )
            BEGIN
                SELECT o.order_id, o.status, o.total_price, o.placed_at
                FROM Orders o
                WHERE o.user_id = p_user_id
                ORDER BY o.placed_at DESC;
            END
        `, (err) => {
            if (err) {
                console.error('Error creating sp_get_user_orders procedure:', err);
            } else {
                console.log('sp_get_user_orders procedure created successfully');
            }
        });
    }
});
 

// User orders endpoint
app.get('/orders/:userId', (req, res) => {
    const userId = req.params.userId;

    db.query(
        `CALL sp_get_user_orders(?)`,
        [userId],
        (err, results) => {
            if (err) {
                console.error('Error fetching orders:', err);
                return res.status(500).json({ message: 'Failed to fetch orders.' });
            }

            // The results will be an array with one element, which is the result set from the procedure
            res.json({ orders: results[0] });
        }
    );
});

// Get orders with status 'placed'
app.get('/api/delivery-orders', (req, res) => {
    db.query('SELECT * FROM Orders WHERE status = "placed"', (err, results) => {
      if (err) {
        console.error('Error fetching orders:', err);
        return res.status(500).json({ error: 'Failed to fetch orders' });
      }
      res.json({ orders: results });
    });
  });
  
  // Update order status to 'delivered'
  app.post('/api/delivery-orders/:orderId', (req, res) => {
    const { orderId } = req.params;
    
    db.query(
      'UPDATE Orders SET status = "delivered" WHERE order_id = ? AND status = "placed"',
      [orderId],
      (err, result) => {
        if (err) {
          console.error('Error updating order status:', err);
          return res.status(500).json({ error: 'Failed to update order status' });
        }
  
        if (result.affectedRows === 0) {
          return res.status(400).json({ error: 'Order not found or already delivered' });
        }
  
        res.json({ message: 'Order status updated to delivered' });
      }
    );
  });
  
// Get all restaurants
app.get('/api/restaurants', (req, res) => {
    const query = 'SELECT * FROM Restaurants';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching restaurants:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results); // Send the list of restaurants as a JSON response
    });
});

// Delete a restaurant 
app.delete('/api/restaurants/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Restaurants WHERE restaurant_id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting restaurant:', err);
            return res.status(500).send('Internal server error');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Restaurant not found');
        }
        res.status(200).send('Restaurant deleted');
    });
});

//customer management
// Get all customers along with their email
app.get('/api/customers', (req, res) => {
    const query = `
        SELECT c.customer_id, u.email, c.preferred_cuisine, c.default_delivery_address
        FROM Customers c
        JOIN Users u ON c.user_id = u.user_id
        WHERE u.user_type = 'customer'`; // Ensure only customers are fetched
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching customers:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results); // Send the list of customers with email as a JSON response
    });
});

// Delete a customer by ID
app.delete('/api/customers/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Customers WHERE customer_id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting customer:', err);
            return res.status(500).send('Internal server error');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Customer not found');
        }
        res.status(200).send('Customer deleted');
    });
});

// Get customer statistics (user count)
app.get('/api/customer-stats', (req, res) => {
    const query = 'SELECT COUNT(*) AS total_customers FROM Customers';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching customer stats:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results[0]); // Send the count as a JSON response
    });
});

app.get('/api/user-order-count', (req, res) => {
    const query = `
        SELECT uc.user_id, u.email, uc.order_count
        FROM user_count uc
        JOIN Users u ON uc.user_id = u.user_id;
    `;

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching user order count data:', error);
            return res.status(500).json({ error: 'Failed to fetch user order count data' });
        }

        // Send the query result if successful
        res.json(results);
    });
});

// Fetch all delivery persons
app.get('/api/delivery-persons', (req, res) => {
    const query = `
        SELECT dp.delivery_id, dp.user_id, dp.vehicle_type, dp.current_location 
        FROM Delivery_Personnel dp;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching delivery persons:', err);
            res.status(500).json({ error: 'Failed to fetch delivery persons' });
        } else {
            res.json(results);
        }
    });
});

// Delete a delivery person
app.delete('/api/delivery-persons/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Delivery_Personnel WHERE delivery_id = ?';
    
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting delivery person:', err);
            res.status(500).json({ error: 'Failed to delete delivery person' });
        } else {
            res.status(200).json({ message: 'Delivery person deleted successfully' });
        }
    });
});

// Start the server
app.listen(8081, () => {
    console.log("Server running on port 8081");
});
