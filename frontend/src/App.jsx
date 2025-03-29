import { Container } from "react-bootstrap";
import CreateItem from "./components/CreateItem";
import ReadItems from "./components/ReadItems";
import UpdateItem from "./components/UpdateItem";
// import DeleteItem from "./components/DeleteItem"; // Uncomment when needed
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Container className="my-4">
      <h1 className="text-center mb-4">Item Management System</h1>

      <div className="mb-4">
        <CreateItem />
      </div>

      <hr />

      <div className="mb-4">
        <ReadItems />
      </div>

      <hr />

      <div className="mb-4">
        <UpdateItem />
      </div>

      {/* Uncomment when DeleteItem is implemented */}
      {/* <hr />
      <div className="mb-4">
        <h3>Delete Item</h3>
        <DeleteItem />
      </div> */}
    </Container>
  );
}

export default App;
