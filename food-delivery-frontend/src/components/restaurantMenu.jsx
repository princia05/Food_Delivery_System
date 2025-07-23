import React, { useEffect, useState } from 'react';
import { Button, Modal, TextField, Typography, Box } from '@mui/material';

const RestaurantMenu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [newItem, setNewItem] = useState({ 
        itemName: '', 
        description: '', 
        price: '', 
        category: '',
        image_url: '' 
    });
    const [currentItem, setCurrentItem] = useState(null);
    const [isSelectingEditItem, setIsSelectingEditItem] = useState(true);

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 350,
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    };

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        const restaurantId = localStorage.getItem('restaurantId');
        const response = await fetch(`http://localhost:8081/restaurant/${restaurantId}/menu`);
        const data = await response.json();
        setMenuItems(data);
        console.log("Menu Items:", data);
    };

    const handleAddMenuItem = async () => {
        const restaurantId = localStorage.getItem('restaurantId');
        console.log(restaurantId);

        await fetch(`http://localhost:8081/restaurant/${restaurantId}/menu`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newItem),
        });

        setOpenAddModal(false);
        fetchMenuItems();
    };

    const handleEditMenuItem = async () => {
        if (!currentItem?.item_name || !currentItem?.menu_id) {
            alert("Please provide valid item details.");
            return;
        }

        await fetch(`http://localhost:8081/menu/${currentItem.menu_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                itemName: currentItem.item_name,
                description: currentItem.description,
                price: currentItem.price,
                category: currentItem.category,
                image_url: currentItem.image_url
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.Status === 'Success') {
                setOpenEditModal(false);
                fetchMenuItems();
            } else {
                alert('Error updating item: ' + data.Error);
            }
        })
        .catch(err => {
            alert("Error updating item: " + err.message);
        });
    };

    const handleDeleteMenuItem = async (menuId) => {
        const restaurantId = localStorage.getItem('restaurantId');
        await fetch(`http://localhost:8081/restaurant/${restaurantId}/menu/${menuId}`, {
            method: 'DELETE',
        });
        setOpenDeleteModal(false);
        fetchMenuItems();
    };

    const openEditModalWithItem = (item) => {
        setCurrentItem(item);
        setOpenEditModal(true);
    };

    return (
        <div style={styles.container}>
            <Typography variant="h4" style={styles.title}>Restaurant Menu</Typography>
            <div style={styles.buttonGroup}>
                <Button variant="contained" onClick={() => setOpenAddModal(true)} style={styles.addButton}>
                    Add Menu Item
                </Button>
                <Button variant="contained" onClick={() => setOpenEditModal(true)} style={styles.editButton}>
                    Edit Menu Item
                </Button>
                <Button variant="contained" onClick={() => setOpenDeleteModal(true)} style={styles.deleteButton}>
                    Delete Menu Item
                </Button>
            </div>

            {/* Display Menu Items */}
            <ul style={styles.menuList}>
                {menuItems.map((item) => (
                    <li key={item.menu_id} style={styles.menuItem}>
                        <Typography style={styles.menuText}>{item.item_name} - {item.description} - ${item.price} - {item.category}</Typography>
                        {item.image_url && <img src={item.image_url} alt={item.item_name} style={styles.menuImage} />}
                    </li>
                ))}
            </ul>

            {/* Add Item Modal */}
            <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" style={styles.modalTitle}>Add Menu Item</Typography>
                    <TextField label="Item Name" value={newItem.itemName} onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })} fullWidth margin="normal" />
                    <TextField label="Description" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} fullWidth margin="normal" />
                    <TextField label="Price" type="number" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} fullWidth margin="normal" />
                    <TextField label="Category" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} fullWidth margin="normal" />
                    <TextField label="Image URL" value={newItem.image_url} onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })} fullWidth margin="normal" placeholder="Enter image URL" />
                    <Button variant="contained" onClick={handleAddMenuItem} style={styles.modalButton} fullWidth>
                        Add
                    </Button>
                </Box>
            </Modal>

            {/* Edit Item Modal */}
            <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" style={styles.modalTitle}>Edit Menu Item</Typography>
                    <TextField label="Item Name" value={currentItem?.item_name || ''} onChange={(e) => setCurrentItem({ ...currentItem, item_name: e.target.value })} fullWidth margin="normal" />
                    <TextField label="Description" value={currentItem?.description || ''} onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })} fullWidth margin="normal" />
                    <TextField label="Price" type="number" value={currentItem?.price || ''} onChange={(e) => setCurrentItem({ ...currentItem, price: e.target.value })} fullWidth margin="normal" />
                    <TextField label="Category" value={currentItem?.category || ''} onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })} fullWidth margin="normal" />
                    <TextField label="Image URL" value={currentItem?.image_url || ''} onChange={(e) => setCurrentItem({ ...currentItem, image_url: e.target.value })} fullWidth margin="normal" />
                    <Button variant="contained" onClick={handleEditMenuItem} style={styles.modalButton} fullWidth>
                        Save Changes
                    </Button>
                </Box>
            </Modal>

            {/* Delete Item Modal */}
            <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" style={styles.modalTitle}>Delete Menu Item</Typography>
                    <Typography>Select a menu item to delete:</Typography>
                    {menuItems.map((item) => (
                        <Button key={item.menu_id} onClick={() => handleDeleteMenuItem(item.menu_id)} style={styles.deleteItemButton} fullWidth>
                            {item.item_name}
                        </Button>
                    ))}
                </Box>
            </Modal>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#fff8f0',
        minHeight: '100vh',
    },
    title: {
        color: '#FF8C00',
        textAlign: 'center',
        marginBottom: '20px',
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '20px',
    },
    addButton: {
        backgroundColor: '#FF8C00',
        color: '#fff',
    },
    editButton: {
        backgroundColor: '#FFA500',
        color: '#fff',
    },
    deleteButton: {
        backgroundColor: '#FF4500',
        color: '#fff',
    },
    menuList: {
        listStyle: 'none',
        padding: '0',
    },
    menuItem: {
        padding: '15px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        marginBottom: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    },
    menuText: {
        color: '#333',
        fontWeight: 'bold',
    },
    menuImage: {
        width: '60px',
        height: '60px',
        borderRadius: '8px',
        objectFit: 'cover',
    },
    modalTitle: {
        color: '#FF8C00',
        marginBottom: '15px',
    },
    modalButton: {
        backgroundColor: '#FF8C00',
        color: '#fff',
        marginTop: '15px',
    },
    deleteItemButton: {
        color: '#FF4500',
        fontWeight: 'bold',
        marginTop: '10px',
    }
};

export default RestaurantMenu;
