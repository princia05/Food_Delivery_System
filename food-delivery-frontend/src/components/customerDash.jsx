import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box, Grid, Card, CardContent } from '@mui/material';

function CustomerDash() {
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState(null);

  // Fetch customer data from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.user_type === 'customer') {
      setCustomerData(user);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleViewRestaurants = () => {
    navigate('/restaurants');  // Navigate to restaurants list page
  };

  const offers = [
    {
      id: 1,
      title: '20% Off on First Order',
      description: 'Get 20% off on your first food delivery order. Use code: FIRST20',
      image: 'https://www.authenticroyal.com/wp-content/uploads/2024/06/Chicken-Biryani-Royal-Chefs-Secret_03-1024x687.jpg'
    },
    {
      id: 2,
      title: 'Buy 1 Get 1 Free',
      description: 'Order any item and get another item free. Limited time offer!',
      image: 'https://t3.ftcdn.net/jpg/02/52/38/80/360_F_252388016_KjPnB9vglSCuUJAumCDNbmMzGdzPAucK.jpg'
    },
    {
      id: 3,
      title: 'Free Delivery',
      description: 'Enjoy free delivery on all orders above 300.',
      image: 'https://plus.unsplash.com/premium_photo-1661953124283-76d0a8436b87?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D'
    }
  ];

  return (
    <Container style={styles.container}>
      <Box style={styles.welcomeSection}>
        <Typography variant="h4" gutterBottom style={styles.title}>
          Welcome to Our Food Delivery Service
        </Typography>
        <Typography variant="body1" gutterBottom style={styles.subtitle}>
          {`Click below to explore the best restaurants around you!` }
        </Typography>
        <Button variant="contained" style={styles.viewButton} onClick={handleViewRestaurants}>
          View Restaurants
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom style={styles.offersTitle}>
        Special Offers
      </Typography>

      <Grid container spacing={3}>
        {offers.map((offer) => (
          <Grid item xs={12} sm={6} md={4} key={offer.id}>
            <Card style={styles.offerCard}>
              <img src={offer.image} alt={offer.title} style={styles.offerImage} />
              <CardContent>
                <Typography variant="h6" style={styles.offerTitle}>{offer.title}</Typography>
                <Typography variant="body2" style={styles.offerDescription}>{offer.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#fff8f0',
    minHeight: '100vh',
  },
  welcomeSection: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    color: '#FF8C00',
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#333',
    marginBottom: '20px',
  },
  viewButton: {
    backgroundColor: '#FF8C00',
    color: '#fff',
    padding: '10px 20px',
    fontWeight: 'bold',
  },
  offersTitle: {
    color: '#FF8C00',
    textAlign: 'center',
    margin: '20px 0',
  },
  offerCard: {
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'transform 0.3s ease',
  },
  offerImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
  },
  offerTitle: {
    color: '#FF8C00',
    fontWeight: 'bold',
  },
  offerDescription: {
    color: '#555',
  },
};

export default CustomerDash;
