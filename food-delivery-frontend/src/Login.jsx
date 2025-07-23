import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('customer');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8081/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, user_type: userType }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful:', data);

                // Save essential user data to localStorage
                localStorage.setItem('userId', data.userId);  // Save user ID for later use
                localStorage.setItem('userType', userType);   // Save user type for conditional logic
                if (userType === 'restaurant_owner') {
                    localStorage.setItem('restaurantId', data.restaurantId);  // Save restaurant ID if applicable
                }

                // Conditional navigation based on user type
                if (userType === 'restaurant_owner') {
                    navigate('/restaurant-menu');
                } else if (userType === 'customer') {
                    navigate('/customer-dash');
                } else if (userType === 'admin') {
                    navigate('/admin-dash');
                } else {
                    navigate('/delivery-orders');
                }
            } else {
                setError(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.header}>Login</h2>
                <form onSubmit={handleLogin} style={styles.form}>
                    {error && <p style={styles.error}>{error}</p>}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>User Type:</label>
                        <select
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            style={styles.input}
                        >
                            <option value="customer">Customer</option>
                            <option value="restaurant_owner">Restaurant Owner</option>
                            <option value="delivery_personnel">Delivery Personnel</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button type="submit" style={styles.button}>Login</button>
                </form>
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
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'left',
    },
    label: {
        fontSize: '16px',
        color: '#555',
        marginBottom: '5px',
    },
    input: {
        padding: '12px',
        fontSize: '16px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        marginBottom: '10px',
        outline: 'none',
        transition: 'border-color 0.3s ease',
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
    },
    buttonHover: {
        backgroundColor: '#FF9A41', // Darker pastel orange for hover
    },
    error: {
        color: 'red',
        marginBottom: '10px',
        fontSize: '14px',
    }
};

export default Login;
