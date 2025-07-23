import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path); // Navigate to the respective management page
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.header}>Admin Dashboard</h2>
                <div style={styles.buttonContainer}>
                    <button style={styles.button} onClick={() => handleNavigation('/restaurant-management')}>
                        Restaurant Management
                    </button>
                    <button style={styles.button} onClick={() => handleNavigation('/customer-management')}>
                        Customer Management
                    </button>
                    <button style={styles.button} onClick={() => handleNavigation('/delivery-person-management')}>
                        Delivery Person Management
                    </button>
                </div>
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
        maxWidth: '400px',
        textAlign: 'center',
    },
    header: {
        fontFamily: '"Arial", sans-serif',
        color: '#333',
        marginBottom: '20px',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    button: {
        padding: '12px',
        fontSize: '16px',
        cursor: 'pointer',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: '#FFA652', // Pastel orange
        color: '#fff',
        transition: 'background-color 0.3s ease',
        width: '100%',
    },
};

export default AdminDashboard;
