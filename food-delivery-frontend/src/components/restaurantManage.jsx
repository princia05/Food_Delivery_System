import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RestaurantManagement = () => {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch list of restaurants from the backend
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await fetch('http://localhost:8081/api/restaurants'); // Full URL with port 8081
                const data = await response.json();
                setRestaurants(data); // Assuming the API returns an array of restaurants
            } catch (error) {
                console.error('Error fetching restaurants:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurants();
    }, []);

    // Delete a restaurant
    const handleDeleteRestaurant = async (id) => {
        try {
            const response = await fetch(`http://localhost:8081/api/restaurants/${id}`, { // Full URL with port 8081
                method: 'DELETE',
            });
            if (response.ok) {
                setRestaurants(prevRestaurants => prevRestaurants.filter(restaurant => restaurant.restaurant_id !== id));
            } else {
                alert('Failed to delete restaurant');
            }
        } catch (error) {
            console.error('Error deleting restaurant:', error);
            alert('Error deleting restaurant');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.header}>Restaurant Management</h2>
                {restaurants.length === 0 ? (
                    <p>No restaurants available</p>
                ) : (
                    <div style={styles.restaurantList}>
                        {restaurants.map((restaurant) => (
                            <div key={restaurant.restaurant_id} style={styles.restaurantItem}>
                                <p>{restaurant.name}</p>
                                <button
                                    style={styles.deleteButton}
                                    onClick={() => handleDeleteRestaurant(restaurant.restaurant_id)}
                                >
                                    Delete Restaurant
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f7f7f7',
    },
    card: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '600px',
        textAlign: 'center',
    },
    header: {
        fontFamily: '"Arial", sans-serif',
        color: '#333',
        marginBottom: '20px',
    },
    restaurantList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    restaurantItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        borderBottom: '1px solid #ddd',
    },
    deleteButton: {
        padding: '8px 16px',
        fontSize: '14px',
        backgroundColor: '#FF4D4D', // Red for delete
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
};

export default RestaurantManagement;
