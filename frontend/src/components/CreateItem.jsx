import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert } from "react-bootstrap";

const CreateItem = ({ fetchItems }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    price: ""
  });
  const [message, setMessage] = useState({ text: "", variant: "info" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", variant: "info" });

    try {
      const response = await axios.post("http://localhost:3000/items", formData);

      if (response.status === 201) {
        setMessage({ 
          text: "Item added successfully!", 
          variant: "success" 
        });
        setFormData({
          name: "",
          category: "",
          quantity: "",
          price: ""
        });
        fetchItems();
      }
    } catch (error) {
      console.error("Error adding item:", error);
      setMessage({ 
        text: `Error: ${error.response?.data?.error || error.message}`,
        variant: "danger"
      });
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-3">Create Item</h2>

      {message.text && (
        <Alert variant={message.variant}>{message.text}</Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            data-testid="name-input"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formCategory">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            data-testid="category-input"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formQuantity">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="0"
            data-testid="quantity-input"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPrice">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            data-testid="price-input"
          />
        </Form.Group>

        <Button 
          variant="primary" 
          type="submit"
          data-testid="submit-button"
        >
          Add Item
        </Button>
      </Form>
    </Container>
  );
};

export default CreateItem;