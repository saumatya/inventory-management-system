import { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert } from "react-bootstrap";

export default function UpdateItem() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdate = async (event) => {
    event.preventDefault();
    setMessage(""); 

    try {
      const response = await axios.put(`http://localhost:3000/items/${id}`, {
        name,
        category,
        quantity,
        price,
      });

      setMessage(`Item updated successfully: ${response.data.id}`);
      setId("");
      setName("");
      setCategory("");
      setQuantity("");
      setPrice("");
    } catch (error) {
      setMessage(`Error updating item: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-3">Update Item</h2>

      {message && <Alert variant={message.includes("Error") ? "danger" : "success"}>{message}</Alert>}

      <Form onSubmit={handleUpdate}>
        <Form.Group className="mb-3">
          <Form.Label>Item ID</Form.Label>
          <Form.Control
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter item ID"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter new name"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter new category"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter new quantity"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter new price"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Update Item
        </Button>
      </Form>
    </Container>
  );
}
