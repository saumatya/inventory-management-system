const express = require("express");
const cors = require("cors");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173/" })); // Allow all origins
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "db", "items.db"),
  logging: false,
});

const Item = sequelize.define("Item", {
  name: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log(" Database connected successfully!");
    await sequelize.sync({ alter: true });
    console.log(" Database synchronized!");
  } catch (error) {
    console.error(" Database connection error:", error);
  }
})();

app.post("/items", async (req, res) => {
  try {
    const { name, category, quantity, price } = req.body;
    if (!name || !category || !quantity || !price) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newItem = await Item.create({ name, category, quantity, price });
    res.status(201).json(newItem);
  } catch (error) {
    console.error(" Error adding item:", error);
    res.status(500).json({ error: "Error adding item" });
  }
});

app.get("/items", async (req, res) => {
  try {
    const items = await Item.findAll();
    res.status(200).json(items);
  } catch (error) {
    console.error(" Error fetching items:", error);
    res.status(500).json({ error: "Error fetching items" });
  }
});

app.put("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, quantity, price } = req.body;

    const item = await Item.findByPk(id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    item.name = name || item.name;
    item.category = category || item.category;
    item.quantity = quantity || item.quantity;
    item.price = price || item.price;

    await item.save();
    res.json(item);
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ error: "Error updating item" });
  }
});

app.delete("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByPk(id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    await item.destroy();
    res.json({ success: true, message: "Item deleted", id });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: "Error deleting item" });
  }
});

app.use(express.static(path.join(__dirname, "client", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
