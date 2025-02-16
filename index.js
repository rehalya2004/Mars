require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const Order = require("./models/order");
const Admin = require("./models/Admin");

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB 🚀"))
  .catch(err => console.error("MongoDB connection error:", err));

const SECRET_KEY = "your_super_secure_secret_key"; // Change this to a secure key

// Default route
app.get("/", (req, res) => {
  res.send("Food Order App Backend is Running! 🚀");
});
app.post("/order", async (req, res) => {
  try {
    const { name, items } = req.body;

    const menu = {
      "Avocado Toast": 150,
      "Grilled Chicken Salad": 200,
      "Smoothie Bowl": 180,
      "Quinoa Bowl": 220,
      "Oatmeal with Fruits": 120
    };

    let totalPrice = 0;
    items.forEach(item => {
      if (!menu[item.foodItem]) {
        return res.status(400).json({ error: `Invalid item: ${item.foodItem}` });
      }
      totalPrice += menu[item.foodItem] * item.quantity;
    });

    // Generate a unique token number
    const tokenNumber = Math.floor(1000 + Math.random() * 9000);

    // Save the order
    const newOrder = new Order({ name, items, totalPrice, tokenNumber });
    await newOrder.save();

    res.status(201).json({
      message: "Order placed successfully!",
      order: { name, items, totalPrice, tokenNumber }
    });

  } catch (error) {
    res.status(500).json({ error: "Error placing order" });
  }
});



// 📌 2️⃣ Get All Orders (GET)
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error fetching orders" });
  }
});

// 📌 3️⃣ Admin Registration
app.post("/admin/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const newAdmin = new Admin({ username, password });
    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error registering admin", details: error.message });
  }
});

// 📌 4️⃣ Admin Login
app.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username, password });
    
    if (!admin) return res.status(401).json({ error: "Invalid username or password" });

    const token = jwt.sign({ id: admin._id }, SECRET_KEY, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
});

// Middleware to protect admin routes
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access Denied" });

  try {
    const verified = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
    req.admin = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid Token" });
  }
};

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🔥`);
});