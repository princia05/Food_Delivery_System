// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './components/home';
import AdminDashboard from './components/adminDashboard';
import AddRestaurant from './components/addrestaurant';
import AdminLogin from './components/adminLogin';
import RestaurantDashboard from './components/restaurantDashboard';
import RestaurantLogin from './components/restaurantLogin';
import CustomerOptions from './components/customerOptions';
import CustomerLogin from './components/customerLogin';
import CustomerSignup from './components/customerSignup';
import CustomerDashboard from './components/customerDashboard'; 

// Function to check if admin is logged in
const isAdminLoggedIn = () => {
  return localStorage.getItem('adminLoggedIn') === 'true';
};

// Function to check if restaurant user is logged in
const isRestaurantLoggedIn = () => {
  return localStorage.getItem('restaurantLoggedIn') === 'true';
};

// Function to check if customer is logged in
const isCustomerLoggedIn = () => {
  return localStorage.getItem('customerLoggedIn') === 'true';
};

const App = () => (
  <Router>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/adminLogin" element={<AdminLogin />} />
      <Route path="/restaurant/restaurantLogin" element={<RestaurantLogin />} />

      {/* Customer Routes */}
      <Route path="/customer" element={<CustomerOptions />} />
      <Route path="/customer/login" element={<CustomerLogin />} />
      <Route path="/customer/signup" element={<CustomerSignup />} />

      {/* Protected Admin Routes */}
      <Route 
        path="/adminDashboard" 
        element={isAdminLoggedIn() ? <AdminDashboard /> : <Navigate to="/admin/adminLogin" />} 
      />
      <Route 
        path="/admin/add-restaurant" 
        element={isAdminLoggedIn() ? <AddRestaurant /> : <Navigate to="/admin/adminLogin" />} 
      />

      {/* Protected Restaurant Routes */}
      <Route 
        path="/restaurantDashboard" 
        element={isRestaurantLoggedIn() ? <RestaurantDashboard /> : <Navigate to="/restaurant/restaurantLogin" />} 
      />

      {/* Protected Customer Dashboard Route */}
      <Route 
        path="/customer/dashboard" 
        element={isCustomerLoggedIn() ? <CustomerDashboard /> : <Navigate to="/customer/login" />} 
      />
    </Routes>
  </Router>
);

export default App;
