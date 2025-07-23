import React, { useState, useEffect } from 'react';

const DeliveryPersonManagement = () => {
    const [deliveryPersons, setDeliveryPersons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch delivery persons from backend
        const fetchDeliveryPersons = async () => {
            try {
                const response = await fetch('http://localhost:8081/api/delivery-persons');
                const data = await response.json();
                setDeliveryPersons(data);
            } catch (error) {
                console.error('Error fetching delivery persons:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDeliveryPersons();
    }, []);

    // Delete a delivery person
    const handleDeleteDeliveryPerson = async (id) => {
        try {
            const response = await fetch(`http://localhost:8081/api/delivery-persons/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setDeliveryPersons((prevDeliveryPersons) =>
                    prevDeliveryPersons.filter((person) => person.delivery_id !== id)
                );
            } else {
                alert('Failed to delete delivery person');
            }
        } catch (error) {
            console.error('Error deleting delivery person:', error);
            alert('Error deleting delivery person');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Delivery Person Management</h2>
            {deliveryPersons.length === 0 ? (
                <p>No delivery persons available</p>
            ) : (
                <div style={styles.listContainer}>
                    {deliveryPersons.map((person) => (
                        <div key={person.delivery_id} style={styles.deliveryPersonItem}>
                            <p style={styles.horizontalLayout}>
                                <span>User ID: {person.user_id}</span>
                                <span>Vehicle: {person.vehicle_type}</span>
                                <span>Location: {person.current_location}</span>
                            </p>
                            <button
                                style={styles.deleteButton}
                                onClick={() => handleDeleteDeliveryPerson(person.delivery_id)}
                            >
                                Delete Delivery Person
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#f7f7f7',
    },
    header: {
        fontFamily: '"Arial", sans-serif',
        color: '#333',
        marginBottom: '20px',
    },
    listContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    deliveryPersonItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        borderBottom: '1px solid #ddd',
    },
    horizontalLayout: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '60%',
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

export default DeliveryPersonManagement;
