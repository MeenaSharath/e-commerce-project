require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Load models dynamically
const models = {
  products: require('./Models/Furniture'),
  cosmetics: require('./Models/Cosmetic'),
  sales: require('./Models/Sales'),
  fashion: require('./Models/Fashion'),
  electronics: require('./Models/Electronics'),
  grocery: require('./Models/Grocery'),
  entertainment: require('./Models/Entertainment'),
  health: require('./Models/Health'),
  offers: require('./Models/Offers'),
  users: require('./Models/RegisterUser'),
  orders: require('./Models/OrderModel'),
};

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'my_super_secret_key_123456';
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce";

app.use(cors({
  origin: ['https://e-commerce-website-ten-nu-97.vercel.app','http://localhost:5173', 'http://localhost:3000','https://e-commerce-project-dashboard.onrender.com'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// DB connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Auth middleware
function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Auth routes
app.post('/register', async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);
    const user = await models.users.create({ ...req.body, password: hashed });
    res.json({ id: user._id, email: user.email });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/login', async (req, res) => {
  const user = await models.users.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: 'Not found' });
  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.status(401).json({ message: 'Wrong credentials' });
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  res.json({ message: 'Logged in' });
});

app.get('/me', authenticateToken, async (req, res) => {
  const u = await models.users.findById(req.user.id, 'name email');
  res.json(u || {});
});

// Generic CRUD router
const router = express.Router();

router.param('model', (req, res, next, model) => {
  if (!models[model]) return res.status(404).send('Model not found');
  req.Model = models[model];
  next();
});

router.get('/:model', async (req, res) => {
  const data = await req.Model.find({});
  res.json(data);
});

router.post('/:model', async (req, res) => {
  const newItem = await req.Model.create(req.body);
  res.json(newItem);
});

router.get('/:model/:id', async (req, res) => {
  res.json(await req.Model.findById(req.params.id));
});

router.put('/:model/:id', async (req, res) => {
  res.json(await req.Model.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

router.delete('/:model/:id', async (req, res) => {
  res.json(await req.Model.findByIdAndDelete(req.params.id));
});

// Example: GET /fashion, POST /products, etc.
app.use('/', router);

// Orders route
app.get('/orders/user/:email', async (req, res) => {
  const orders = await models.orders.find({ "billingAddress.email": req.params.email });
  res.json(orders);
});

// Mount your other routes
app.use(require('./routes/checkout'));
app.use(require('./routes/orderRoutes'));
app.use('/salepage', require('./routes/saleItemsRoutes'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Server is running on port ${PORT}`)
);
