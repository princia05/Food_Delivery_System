import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('http://localhost:8081/restaurants');
        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/restaurants/${restaurantId}/menu`);
  };

  return (
    <Container sx={{ backgroundColor: '#fff', padding: '20px' }}>
      <Box sx={{ backgroundColor: '#FFA652', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#fff' }}>
          Restaurants Near You
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {restaurants.length === 0 ? (
          <Typography variant="h6" sx={{ color: '#FFA652' }}>No restaurants available</Typography>
        ) : (
          restaurants.map((restaurant) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4} 
              key={restaurant.restaurant_id} 
              onClick={() => handleRestaurantClick(restaurant.restaurant_id)} 
              sx={{ cursor: 'pointer' }}
            >
              <Card sx={{ borderRadius: '8px', boxShadow: 3, '&:hover': { boxShadow: 6 } }}>
                <img 
                  src={restaurant.image_url} 
                  alt={restaurant.name} 
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px 8px 0 0' }} 
                />
                <CardContent sx={{ backgroundColor: '#FFB74D', color: '#fff', borderRadius: '0 0 8px 8px' }}>
                  <Typography variant="h6">{restaurant.name}</Typography>
                  <Typography variant="body2">Cuisine: {restaurant.cuisine_type}</Typography>
                  <Typography variant="body2">Rating: {restaurant.rating}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
}

export default RestaurantsPage;
