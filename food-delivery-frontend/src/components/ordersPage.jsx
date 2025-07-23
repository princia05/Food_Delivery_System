import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Card, CardContent, Button, Box, CircularProgress } from '@mui/material';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        setError("Please log in to view your orders.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8081/orders/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

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
    <Container sx={{ backgroundColor: '#fffaf0', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mt: 3, mb: 3, color: '#FF5722' }}>
        Your Orders
      </Typography>

      <Grid container spacing={3}>
        {orders.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
              No orders placed yet.
            </Typography>
          </Grid>
        ) : (
          orders.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order.order_id}>
              <Card elevation={3} sx={{ height: '100%', backgroundColor: '#FFCD90' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: '#FF5722' }}>
                    Order #{order.order_id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {order.status}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 2, color: '#FF5722' }}>
                    Total: ${order.total_price.toFixed(2)}
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{
                      color: '#FF5722',
                      borderColor: '#FF5722',
                      '&:hover': { borderColor: '#ff3d00', color: '#ff3d00' },
                      fullWidth: true,
                      mt: 2,
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
}

export default OrdersPage;
