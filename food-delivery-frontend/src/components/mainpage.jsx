import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    const handleSignup = () => {
        navigate('/signup');
    };

    return (
        <div style={styles.container}>
            <div style={styles.overlay}>
                <h1 style={styles.appName}>NomNomNow</h1>
                <p style={styles.subtitle}>Welcome! &#9829;</p>  {/* Using the heart entity */}

                <div style={styles.buttonContainer}>
                    <button style={styles.button} onClick={handleLogin}>Login</button>
                    <button style={styles.button} onClick={handleSignup}>Signup</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh', // Ensure the container covers the full screen
        width: '100vw', // Ensures the container covers the full width
        background: `url('https://wallpapers.com/images/hd/food-4k-spdnpz7bhmx4kv2r.jpg') no-repeat center center fixed`,
        backgroundSize: 'cover', // Ensure the image covers the entire page
        backgroundPosition: 'center',
        overflow: 'hidden', // Hide any overflow content
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.67)', // Faded transparency
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        textAlign: 'center',
    },
    appName: {
        fontFamily: '"Times New Roman", serif',
        fontWeight: 'bold',
        fontSize: '70px',
        color: '#FF7F50', // Coral-orange color
        marginBottom: '10px',
    },
    subtitle: {
        fontSize: '20px',
        color: '#333',
        marginBottom: '30px',
    },
    buttonContainer: {
        display: 'flex',
        gap: '20px',
    },
    button: {
        padding: '12px 25px',
        fontSize: '16px',
        cursor: 'pointer',
        border: 'none',
        borderRadius: '25px',
        backgroundColor: '#FFA652', // Orange color for buttons
        color: '#fff',
        transition: 'background-color 0.3s ease',
    },
};

// Ensure the body and html cover the full height of the viewport
const globalStyles = {
    html: {
        height: '100%',
    },
    body: {
        height: '100%',
        margin: 0,
        overflow: 'hidden', // Hide scrollbars
    },
};

export default WelcomePage;
