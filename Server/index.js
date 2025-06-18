require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const UsersModel = require('./Models/RegisterUser');
const OrderModel = require('./Models/OrderModel');
const checkoutRoutes = require("./routes/checkout");
const orderRoutes = require("./routes/orderRoutes");
const saleItemsRoutes = require("./routes/saleItemsRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

const allowedOrigins = [
  'vercel.app',
  'onrender.com',
  'localhost:5173',
  'localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.some(allowed => origin.includes(allowed))) {
      callback(null, true);
    } else {
      console.error('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Welcome to the E-commerce Project Dashboard API');
});

// Connect MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce";
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected", MONGO_URI))
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
  process.exit(1);
});

// Middleware routes
app.use("/salepage", saleItemsRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/orders", orderRoutes);
app.use("/categories", categoryRoutes); 

// JWT token secret
const JWT_SECRET = 'my_super_secret_key_123456';

// Auth Middleware
function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Auth Routes
app.get('/check-auth', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ isAuthenticated: false });
  jwt.verify(token, JWT_SECRET, (err) => {
    res.json({ isAuthenticated: !err });
  });
});

app.post('/registerUser', async (req, res) => {
  try {
    const newUser = new UsersModel(req.body);
    if (!newUser.password.startsWith("$2b$")) {
      newUser.password = await bcrypt.hash(newUser.password, 10);
    }
    await newUser.save();
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/loginUser', async (req, res) => {
  const { email, password } = req.body;
  const user = await UsersModel.findOne({ email });
  if (!user) return res.status(404).json({ message: 'No user found' });

  const match = password === user.password;
  if (!match) return res.status(401).json({ message: 'Incorrect password' });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.json({ message: 'Success', token });
});

app.get('/logout', (req, res) => {
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',  
  });

  res.status(200).json({ message: "Logged out successfully" });
});

app.put('/updateUser', authenticateToken, async (req, res) => {
  const { name, email, oldPassword, newPassword } = req.body;
  try {
    const user = await UsersModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Old password incorrect" });

    user.name = name;
    user.email = email;
    if (newPassword) user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "User updated", user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get('/getCurrentUser', authenticateToken, async (req, res) => {
  try {
    const user = await UsersModel.findById(req.user.id).select('name email');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get("/getOrderDetails/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const orders = await OrderModel.find({ "billingAddress.email": email });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
