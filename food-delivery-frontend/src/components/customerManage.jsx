import React, { useState, useEffect } from 'react';

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [customerStats, setCustomerStats] = useState(null);
    const [userOrderCount, setUserOrderCount] = useState([]); // Added state for user order count

    // Fetch list of customers from the backend
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch('http://localhost:8081/api/customers');
                const data = await response.json();
                setCustomers(data);
            } catch (error) {
                console.error('Error fetching customers:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchCustomerStats = async () => {
            try {
                const response = await fetch('http://localhost:8081/api/customer-stats');
                const data = await response.json();
                setCustomerStats(data);
            } catch (error) {
                console.error('Error fetching customer stats:', error);
            }
        };

        const fetchUserOrderCount = async () => {
            try {
                const response = await fetch('http://localhost:8081/api/user-order-count');
                const data = await response.json();
                setUserOrderCount(data); // Set the fetched user order count data
            } catch (error) {
                console.error('Error fetching user order count:', error);
            }
        };

        fetchCustomers();
        fetchCustomerStats();
        fetchUserOrderCount(); // Fetch user order count
    }, []);

    // Delete a customer
    const handleDeleteCustomer = async (id) => {
        try {
            const response = await fetch(`http://localhost:8081/api/customers/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setCustomers(prevCustomers => prevCustomers.filter(customer => customer.customer_id !== id));
            } else {
                alert('Failed to delete customer');
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
            alert('Error deleting customer');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.header}>Customer Management</h2>
                {customers.length === 0 ? (
                    <p>No customers available</p>
                ) : (
                    <div style={styles.customerList}>
                        {customers.map((customer) => (
                            <div key={customer.customer_id} style={styles.customerItem}>
                                <p>{customer.email}</p> {/* Displaying only the email */}
                                <button
                                    style={styles.deleteButton}
                                    onClick={() => handleDeleteCustomer(customer.customer_id)}
                                >
                                    Delete Customer
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={styles.statsCard}>
                <h3 style={styles.header}>Customer Stats</h3>
                {customerStats ? (
                    <p>Total Customers: {customerStats.total_customers}</p>
                ) : (
                    <p>Loading customer stats...</p>
                )}
            </div>

            {/* Displaying User Order Count */}
            <div style={styles.statsCard}>
                <h3 style={styles.header}>User Order Count</h3>
                {userOrderCount.length === 0 ? (
                    <p>No user order data available</p>
                ) : (
                    <div style={styles.userOrderList}>
                        {userOrderCount.map((user) => (
                            <div key={user.user_id} style={styles.userOrderItem}>
                                <p style={styles.horizontalLayout}>
                                    <span>User ID: {user.user_id}</span>
                                    <span>Email: {user.email}</span>
                                    <span>Order Count: {user.order_count}</span>
                                </p>
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
        flexDirection: 'column',  // Changed to column for vertical alignment
        alignItems: 'flex-start',
        padding: '20px',
        backgroundColor: '#f7f7f7',
        maxWidth: '1200px', // Limit the width of the content
        margin: '0 auto', // Center the content horizontally
    },
    card: {
        backgroundColor: '#fff',
        padding: '20px', // Reduced padding to fit content better
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        width: '100%',
        marginBottom: '15px', // Reduced margin between sections
    },
    statsCard: {
        backgroundColor: '#fff',
        padding: '20px', // Reduced padding for better fit
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        width: '100%',
        marginBottom: '15px', // Reduced margin between sections
        textAlign: 'center',
    },
    header: {
        fontFamily: '"Arial", sans-serif',
        color: '#333',
        marginBottom: '15px', // Reduced space below headers
    },
    customerList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px', // Reduced gap between customer items
    },
    userOrderList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px', // Reduced gap between user order items
    },
    customerItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px', // Reduced padding
        borderBottom: '1px solid #ddd',
    },
    userOrderItem: {
        display: 'flex',
        flexDirection: 'column',
        padding: '8px', // Reduced padding
        borderBottom: '1px solid #ddd',
    },
    horizontalLayout: {
        display: 'flex',
        justifyContent: 'space-between', // Aligns items horizontally
    },
    deleteButton: {
        padding: '6px 12px',
        fontSize: '12px', // Reduced font size for a more compact button
        backgroundColor: '#FF4D4D', // Red for delete
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
};

export default CustomerManagement;
