import React, { useState, useEffect } from 'react';

const DeliveryOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from the backend on port 8081
    const fetchOrders = async () => {
      const response = await fetch('http://localhost:8081/api/delivery-orders');
      const data = await response.json();
      setOrders(data.orders);
    };

    fetchOrders();
  }, []);

  const handleDelivery = async (orderId) => {
    // Make API call to mark the order as 'out for delivery'
    const response = await fetch(`http://localhost:8081/api/delivery-orders/${orderId}`, {
      method: 'POST',
    });

    if (response.ok) {
      // Update local state to reflect the delivery status change
      setOrders(orders.map(order =>
        order.order_id === orderId ? { ...order, status: 'delivered' } : order
      ));
    } else {
      console.error('Error marking order as out for delivery');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Delivery Orders</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Order ID</th>
            <th style={styles.tableHeader}>Restaurant ID</th>
            <th style={styles.tableHeader}>Total Price</th>
            <th style={styles.tableHeader}>Status</th>
            <th style={styles.tableHeader}>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.order_id} style={styles.tableRow}>
              <td style={styles.tableCell}>{order.order_id}</td>
              <td style={styles.tableCell}>{order.restaurant_id}</td>
              <td style={styles.tableCell}>${order.total_price.toFixed(2)}</td>
              <td style={styles.tableCell}>{order.status}</td>
              <td style={styles.tableCell}>
                {order.status === 'placed' && (
                  <button
                    style={styles.button}
                    onClick={() => handleDelivery(order.order_id)}
                  >
                    Deliver
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Styling objects
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff3e0', // Light orange background
    minHeight: '100vh',
  },
  title: {
    fontSize: '2rem',
    color: '#FF5722', // Orange title
    marginBottom: '20px',
  },
  table: {
    width: '80%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  tableHeader: {
    backgroundColor: '#FF5722', // Orange header
    color: 'white',
    padding: '10px',
    fontWeight: 'bold',
  },
  tableRow: {
    borderBottom: '1px solid #ddd',
  },
  tableCell: {
    padding: '12px',
    textAlign: 'center',
    color: '#333',
  },
  button: {
    padding: '8px 16px',
    color: 'white',
    backgroundColor: '#FF5722', // Orange button
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#ff3d00', // Darker orange on hover
  },
};

export default DeliveryOrdersPage;
