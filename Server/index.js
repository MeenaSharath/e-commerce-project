require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ProductModel = require('./Models/Furniture');
const CosmeticModel = require('./Models/Cosmetic');
const SalesModel = require('./Models/Sales');
const FashionModel = require('./Models/Fashion');
const ElectronicsModel = require('./Models/Electronics');
const GroceryModel = require('./Models/Grocery');
const EntertainmentModel = require('./Models/Entertainment');
const HealthModel = require('./Models/Health');
const OffersModel = require('./Models/Offers');
const UsersModel = require('./Models/RegisterUser');
const OrderModel = require('./Models/OrderModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const checkoutRoutes = require("./routes/checkout");
const orderRoutes = require("./routes/orderRoutes");
const saleItemsRoutes = require("./routes/saleItemsRoutes");

const app = express();
const cookieParser = require("cookie-parser");
const allowedOrigins = [
  'e-commerce-project-beta-five.vercel.app',
  'e-commerce-website-ten-nu-97.vercel.app',
  'e-commerce-project-dashboard.onrender.com',
  'localhost:5173',
  'localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (
      !origin ||
      allowedOrigins.some(allowed => origin.includes(allowed))
    ) {
      callback(null, true);
    } else {
      console.error('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.get('/', (req, res) => {
  res.send('Welcome to the E-commerce Project Dashboard API');
});
app.use(cookieParser());
app.use(orderRoutes);
app.use("/salepage", saleItemsRoutes);

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected",MONGO_URI))
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
  process.exit(1); // Stop the app if DB connection fails
});

app.use(checkoutRoutes);

const JWT_SECRET = 'my_super_secret_key_123456';

function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    console.log("No token found");
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Invalid token:", err.message);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}


app.get('/check-auth', (req, res) => {
  if (req.cookies && req.cookies.isLoggedIn === 'true') {
    res.json({ isAuthenticated: true });
  } else {
    res.json({ isAuthenticated: false });
  }
});

//Register

app.post('/registerUser', (req, res) => {
    UsersModel.create(req.body)
        .then(emp => res.json(emp))
        .catch(err => res.json(err))
})

app.put('/updateUser', authenticateToken, async (req, res) => {
  const { name, email, oldPassword, newPassword } = req.body;

  try {
   const user = await UsersModel.findById(req.user.id).select('name email password');
    if (!user.password.startsWith("$2b$")) {
  // Detected plain text password
  user.password = await bcrypt.hash(user.password, 10);
  await user.save();
}

    if (!user) return res.status(404).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Old password incorrect" });

    user.name = name;
    user.email = email;
    if (newPassword) user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    // ✅ Proper JSON response
    res.json({ message: "User updated", user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


app.post('/loginUser', (req, res) => {
  const { email, password } = req.body;
  console.log("LOGIN ATTEMPT:", email, password);

  UsersModel.findOne({ email: email })
    .then(emp => {
      if (!emp) {
        return res.status(404).json({ message: 'No record existed' });
      }

      // 🔥 Plain text comparison
      if (password !== emp.password) {
        return res.status(401).json({ message: 'Incorrect password' });
      }

      // ✅ Create token
      const token = jwt.sign({ id: emp._id }, JWT_SECRET, { expiresIn: '1d' });

      // ✅ Set token as cookie
      res.cookie('token', token, {
        httpOnly: false,
        secure: true, 
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      return res.json({ message: 'Success', token });
    })
    .catch(err => {
      console.error("Server error:", err);
      res.status(500).json({ error: 'Server error' });
    });
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
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Furniture

app.get('/productpage', (req, res) => {
    ProductModel.find({})
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.post('/createProd', (req, res) => {
    ProductModel.create(req.body)
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.get('/getProd/:id', (req, res) => {
    const id = req.params.id;
    ProductModel.findById({ _id: id })
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.put('/updateProduct/:id', (req, res) => {
    const id = req.params.id;
    ProductModel.findByIdAndUpdate({ _id: id }, { name: req.body.name, price: req.body.price, rating: req.body.rating, stock: req.body.stock, image: req.body.image })
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.delete('/deleteProd/:id', (req, res) => {
    const id = req.params.id;
    ProductModel.findByIdAndDelete({ _id: id })
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

//Cosmetic

app.get('/cosmeticpage', (req, res) => {
    CosmeticModel.find({})
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.post('/createCos', (req, res) => {
    CosmeticModel.create(req.body)
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.get('/getCos/:id', (req, res) => {
    const id = req.params.id;
    CosmeticModel.findById({ _id: id })
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.put('/updateCos/:id', (req, res) => {
    const id = req.params.id;
    CosmeticModel.findByIdAndUpdate({ _id: id }, { name: req.body.name, price: req.body.price, rating: req.body.rating, stock: req.body.stock, image: req.body.image })
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.delete('/deleteCos/:id', (req, res) => {
    const id = req.params.id;
    CosmeticModel.findByIdAndDelete({ _id: id })
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

//Sales

app.get('/getSale/:id', (req, res) => {
    const id = req.params.id;
    SalesModel.findById({ _id: id })
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.put('/updateSale/:id', (req, res) => {
    const id = req.params.id;
    SalesModel.findByIdAndUpdate({ _id: id }, { orderid: req.body.orderid, name: req.body.name, products: req.body.products})
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.delete('/deleteSale/:id', (req, res) => {
    const id = req.params.id;
    SalesModel.findByIdAndDelete({ _id: id })
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

//Fashion

app.get('/fashionpage', (req, res) => {
    FashionModel.find({})
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.post('/createFashion', (req, res) => {
    FashionModel.create(req.body)
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.get('/getFashion/:id', (req, res) => {
    const id = req.params.id;
    FashionModel.findById({ _id: id })
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.put('/updateFashion/:id', (req, res) => {
    const id = req.params.id;
    FashionModel.findByIdAndUpdate({ _id: id }, { name: req.body.name, price: req.body.price, rating: req.body.rating, stock: req.body.stock, image: req.body.image })
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.delete('/deleteFashion/:id', (req, res) => {
    const id = req.params.id;
    FashionModel.findByIdAndDelete({ _id: id })
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

//electronics

app.get('/electronicspage', (req, res) => {
    ElectronicsModel.find({})
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.post('/createElectronics', (req, res) => {
    ElectronicsModel.create(req.body)
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.get('/getElectronics/:id', (req, res) => {
    const id = req.params.id;
    ElectronicsModel.findById({ _id: id })
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.put('/updateElectronics/:id', (req, res) => {
    const id = req.params.id;
    ElectronicsModel.findByIdAndUpdate({ _id: id }, { name: req.body.name, price: req.body.price, rating: req.body.rating, stock: req.body.stock, image: req.body.image })
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.delete('/deleteElectronics/:id', (req, res) => {
    const id = req.params.id;
    ElectronicsModel.findByIdAndDelete({ _id: id })
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

//Grocery

app.get('/grocerypage', (req, res) => {
    GroceryModel.find({})
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.post('/createGrocery', (req, res) => {
    GroceryModel.create(req.body)
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.get('/getGrocery/:id', (req, res) => {
    const id = req.params.id;
    GroceryModel.findById({ _id: id })
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.put('/updateGrocery/:id', (req, res) => {
    const id = req.params.id;
    GroceryModel.findByIdAndUpdate({ _id: id }, { name: req.body.name, price: req.body.price, rating: req.body.rating, stock: req.body.stock, image: req.body.image })
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.delete('/deleteGrocery/:id', (req, res) => {
    const id = req.params.id;
    GroceryModel.findByIdAndDelete({ _id: id })
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

//Entertainment

app.get('/entertainmentpage', (req, res) => {
    EntertainmentModel.find({})
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.post('/createEntertainment', (req, res) => {
    EntertainmentModel.create(req.body)
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.get('/getEntertainment/:id', (req, res) => {
    const id = req.params.id;
    EntertainmentModel.findById({ _id: id })
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.put('/updateEntertainment/:id', (req, res) => {
    const id = req.params.id;
    EntertainmentModel.findByIdAndUpdate({ _id: id }, { name: req.body.name, price: req.body.price, rating: req.body.rating, stock: req.body.stock, image: req.body.image })
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.delete('/deleteEntertainment/:id', (req, res) => {
    const id = req.params.id;
    EntertainmentModel.findByIdAndDelete({ _id: id })
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

//Health

app.get('/healthpage', (req, res) => {
    HealthModel.find({})
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.post('/createHealth', (req, res) => {
    HealthModel.create(req.body)
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.get('/getHealth/:id', (req, res) => {
    const id = req.params.id;
    HealthModel.findById({ _id: id })
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.put('/updateHealth/:id', (req, res) => {
    const id = req.params.id;
    HealthModel.findByIdAndUpdate({ _id: id }, { name: req.body.name, price: req.body.price, rating: req.body.rating, stock: req.body.stock, image: req.body.image })
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
});

app.delete('/deleteHealth/:id', (req, res) => {
    const id = req.params.id;
    HealthModel.findByIdAndDelete({ _id: id })
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

//Offers

app.get('/offerspage', (req, res) => {
    OffersModel.find({})
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.post('/createOffers', (req, res) => {
    OffersModel.create(req.body)
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.get('/getOffers/:id', (req, res) => {
    const id = req.params.id;
    OffersModel.findById({ _id: id })
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.put('/updateOffers/:id', (req, res) => {
    const id = req.params.id;
    OffersModel.findByIdAndUpdate({ _id: id }, { name: req.body.name, des: req.body.des, price: req.body.price, off: req.body.off, rating: req.body.rating, image: req.body.image })
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

app.delete('/deleteOffers/:id', (req, res) => {
    const id = req.params.id;
    OffersModel.findByIdAndDelete({ _id: id })
        .then(prod => res.json(prod))
        .catch(err => res.json(err))
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});