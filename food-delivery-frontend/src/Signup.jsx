import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [userType, setUserType] = useState('customer'); // Default to 'customer'
  const [additionalInfo, setAdditionalInfo] = useState({});
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'userType') {
      setUserType(value);
      setAdditionalInfo({}); // Reset additional info on user type change
    } else {
      setAdditionalInfo((prevInfo) => ({
        ...prevInfo,
        [name]: value,
      }));

      // Update the corresponding state variables
      if (name === 'email') setEmail(value);
      if (name === 'password') setPassword(value);
      if (name === 'phone') setPhone(value);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      email,
      password,
      phone,
      user_type: userType,
      additional_info: additionalInfo,
    };

    try {
      const response = await axios.post('http://localhost:8081/signup', payload);
      if (response.data.Status === 'Success') {
        // Redirect to login or home page upon successful signup
        navigate('/login');
      } else {
        alert(response.data.Error);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('Error during signup');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.header}>Sign Up</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>User Type:</label>
            <select name="userType" value={userType} onChange={handleChange} style={styles.input}>
              <option value="customer">Customer</option>
              <option value="restaurant_owner">Restaurant Owner</option>
              <option value="delivery_personnel">Delivery Personnel</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email:</label>
            <input type="email" name="email" value={email} onChange={handleChange} required style={styles.input} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password:</label>
            <input type="password" name="password" value={password} onChange={handleChange} required style={styles.input} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Phone:</label>
            <input type="text" name="phone" value={phone} onChange={handleChange} required style={styles.input} />
          </div>

          {/* Conditional fields based on user type */}
          {userType === 'restaurant_owner' && (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>Restaurant Name:</label>
                <input
                  type="text"
                  name="name"
                  value={additionalInfo.name || ''}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Location:</label>
                <input
                  type="text"
                  name="location"
                  value={additionalInfo.location || ''}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Cuisine Type:</label>
                <input
                  type="text"
                  name="cuisine_type"
                  value={additionalInfo.cuisine_type || ''}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Rating:</label>
                <input
                  type="number"
                  name="rating"
                  value={additionalInfo.rating || ''}
                  onChange={handleChange}
                  required
                  min="0"
                  max="5"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Image URL:</label>
                <input
                  type="text"
                  name="image_url"
                  value={additionalInfo.image_url || ''}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </>
          )}

          {userType === 'customer' && (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>Preferred Cuisine:</label>
                <input
                  type="text"
                  name="preferredCuisine"
                  value={additionalInfo.preferredCuisine || ''}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Default Delivery Address:</label>
                <input
                  type="text"
                  name="defaultDeliveryAddress"
                  value={additionalInfo.defaultDeliveryAddress || ''}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </>
          )}

          {userType === 'delivery_personnel' && (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>Vehicle Type:</label>
                <input
                  type="text"
                  name="vehicle_type"
                  value={additionalInfo.vehicle_type || ''}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Delivery Area:</label>
                <input
                  type="text"
                  name="delivery_area"
                  value={additionalInfo.delivery_area || ''}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </>
          )}

          <button type="submit" style={styles.button}>Sign Up</button>
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
    maxWidth: '450px',
  },
  header: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
    fontFamily: '"Arial", sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '16px',
    color: '#555',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    marginTop: '5px',
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
};

export default Signup;
