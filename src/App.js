import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [items, setItems] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [editingItemId, setEditingItemId] = useState(null); // Track the item being edited

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/items/');
                setItems(response.data);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        }

        fetchItems();
    }, []);

    const createItem = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/items/', { name, description });
            setItems([...items, response.data]);
            setName(""); // Clear the input fields after creating an item
            setDescription("");
        } catch (error) {
            console.error("Error creating item:", error);
        }
    }

    const updateItem = async (itemId, updatedItem) => {
        try {
            const response = await axios.put(`http://localhost:8000/api/items/${itemId}`, updatedItem);
            const updatedItems = items.map((item, index) => (index === itemId ? response.data : item));
            setItems(updatedItems);
            setEditingItemId(null); // Clear the editing state
        } catch (error) {
            console.error("Error updating item:", error);
        }
    }

    const deleteItem = async (itemId) => {
        try {
            await axios.delete(`http://localhost:8000/api/items/${itemId}`);
            const updatedItems = items.filter((_, index) => index !== itemId);
            setItems(updatedItems);
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    }

    return (
        <div className="App">
            <h1>FastAPI - React Integration</h1>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Item Name" />
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Item Description" />
            <button onClick={createItem}>Create Item</button>

            {/* Display items */}
            {items.map((item, index) => (
                <div key={index}>
                    <h2>{item.name}</h2>
                    <p>{item.description}</p>

                    {/* Edit button */}
                    <button onClick={() => setEditingItemId(index)}>Edit</button>

                    {/* Update form */}
                    {editingItemId === index && (
                        <>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Item Name"
                            />
                            <input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Item Description"
                            />
                            <button onClick={() => updateItem(index, { name, description })}>
                                Update Item
                            </button>
                        </>
                    )}

                    {/* Delete button */}
                    <button onClick={() => deleteItem(index)}>Delete</button>
                </div>
            ))}
        </div>
    );
}

export default App;
