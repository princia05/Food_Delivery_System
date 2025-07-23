import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Grid, Card, CardContent, Typography, Button, Box, CircularProgress, Snackbar } from '@mui/material';

function CustomerMenuList() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState('');
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8081/restaurants/${restaurantId}/menu`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched menu items:', data);
        setMenuItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [restaurantId]);

  const handleAddToCart = async (item) => {
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

    if (!userId) {
      setCartMessage("Please log in to add items to your cart.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/cart/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ menuId: item.menu_id, quantity: 1 }),
      });
      const data = await response.json();
      if (data.Status === "Success") {
        setCartMessage("Item added to cart successfully!");
      } else {
        setCartMessage("Added item to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setCartMessage("Error adding to cart.");
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error" sx={{ mt: 3 }}>
          Error: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={3} mb={3}>
        <Typography variant="h4" sx={{ color: '#FFA652' }}>Menu Items</Typography> {/* Pastel orange color */}
        <div>
          <Button variant="outlined" color="primary" onClick={() => navigate('/cart')} sx={{ mr: 2 }}>
            View Cart
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate('/orders')} >
            View Your Orders
          </Button>
        </div>
      </Box>

      <Grid container spacing={3}>
        {menuItems.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
              No menu items available for this restaurant.
            </Typography>
          </Grid>
        ) : (
          menuItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.menu_id}>
              <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {item.image_url && (
                  <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                    <img
                      src={item.image_url}
                      alt={item.item_name}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1, backgroundColor: '#FFA652', color: '#fff' }}> {/* Pastel orange color */}
                  <Typography variant="h6" gutterBottom>{item.item_name}</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {item.description}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 2 }} color="white">
                    ${Number(item.price).toFixed(2)}
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    fullWidth
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Snackbar
        open={Boolean(cartMessage)}
        autoHideDuration={3000}
        onClose={() => setCartMessage('')}
        message={cartMessage}
      />
    </Container>
  );
}

export default CustomerMenuList;
