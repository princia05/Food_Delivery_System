import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/mainpage';
import Login from './Login';
import Signup from './Signup';
import RestaurantMenu from './components/restaurantMenu';  
import CustomerDash from './components/customerDash';
import RestaurantsPage from './components/restaurantPage';
import CustomerMenuList from './components/CustomerMenuList';
import CartPage from './components/CartPage'; 
import OrdersPage from './components/ordersPage';
import DeliveryOrder from './components/deliveryOrderPage'; 
import AdminDash from './components/adminDash'; 
import ManageRestaurant from './components/restaurantManage'; 
import ManageCustomer from './components/customerManage'; 
import ManageDeliveryPerson from './components/deliveryPersonManagement'; 

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<WelcomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/customer-dash" element={<CustomerDash />} />
                    <Route path="/restaurants" element={<RestaurantsPage />} />
                    <Route path="/restaurants/:restaurantId/menu" element={<CustomerMenuList />} />
                    <Route path="/restaurant-menu" element={<RestaurantMenu />} />
                    <Route path="/cart" element={<CartPage />} />  
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/delivery-orders" element={<DeliveryOrder />} />
                    <Route path="/admin-dash" element={<AdminDash />} />
                    <Route path="/restaurant-management" element={<ManageRestaurant />} />
                    <Route path="/customer-management" element={<ManageCustomer />} />
                    <Route path="/delivery-person-management" element={<ManageDeliveryPerson />} />

                </Routes>
            </div>
        </Router>
    );
};

export default App;
