import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Table, Button, Alert } from "react-bootstrap";

export default function ReadItems() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:3000/items");
        setItems(response.data);
      } catch (err) {
        setError(
          "Error fetching items: " + (err.response?.data?.error || err.message)
        );
      }
    };
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/items/${id}`);
      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      setError(
        "Error deleting item: " + (err.response?.data?.error || err.message)
      );
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-3">Items List</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {items.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info">No items found</Alert>
      )}
    </Container>
  );
}
