import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Card, CardContent, Typography, Button, Box, CircularProgress, Snackbar } from '@mui/material';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderMessage, setOrderMessage] = useState('');
  const userId = localStorage.getItem('userId'); // Assuming the user is logged in
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!userId) {
        setError('Please log in to view your cart');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8081/cart/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.items?.length > 0) {
          setCartItems(data.items);
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setError('Failed to load cart items');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [userId]);

  const handleCheckout = async () => {
    try {
      const response = await fetch(`http://localhost:8081/checkout/${userId}`, {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok) {
        setOrderMessage('Order placed successfully!');
        setCartItems([]); // Clear cart after successful order
        setTimeout(() => navigate('/orders'), 3000); // Redirect to orders page after 3 seconds
      } else {
        setOrderMessage(data.message || 'Failed to place the order');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      setOrderMessage('Error placing the order');
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
      <Typography variant="h4" sx={{ mt: 3, mb: 3, color: '#FF5722' }}>
        Your Cart
      </Typography>

      <Grid container spacing={3}>
        {cartItems.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
              Cart is empty
            </Typography>
          </Grid>
        ) : (
          cartItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.cart_id}>
              <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#fff3e0' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#FF5722' }}>{item.item_name}</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {item.description}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                    ${Number(item.price).toFixed(2)}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Quantity: {item.quantity}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {cartItems.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCheckout}
            sx={{
              backgroundColor: '#FF5722',
              '&:hover': { backgroundColor: '#ff3d00' },
              padding: '10px 20px',
            }}
          >
            Checkout
          </Button>
        </Box>
      )}

      <Snackbar
        open={Boolean(orderMessage)}
        autoHideDuration={3000}
        onClose={() => setOrderMessage('')}
        message={orderMessage}
      />
    </Container>
  );
}

export default CartPage;
