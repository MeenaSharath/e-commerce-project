const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UsersModel",    // Assuming you have a User model
    required: true,
  },
  cartItems: [
    {
      title: String,
      price: Number,
      quantity: Number,
      returnReason: {
    type: String,
    default: null, // initially no return
  },
    },
  ],
  subtotal: Number,
  total: Number,
  billingAddress: {
    name: String,
    email: String,
    phone: String,
    address: String,
  },
  shippingAddress: {
    name: String,
    email: String,
    phone: String,
    address: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const OrderModel = mongoose.model("Order", OrderSchema);
module.exports = OrderModel;
