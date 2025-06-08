const express = require("express");
const router = express.Router();
const Order = require("../Models/OrderModel");

router.post("/api/checkout", async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      subtotal,
      total,
      billing,
      shipping,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart items are required" });
    }

    const order = new Order({
      userId,
      cartItems,
      subtotal,
      total,
      billingAddress: {
        name: billing.name,
        email: billing.email,
        phone: billing.phone,
        address: `${billing.address}, ${billing.zip}`
      },
      shippingAddress: {
        name: shipping.name,
        email: shipping.email,
        phone: shipping.phone,
        address: `${shipping.address}, ${shipping.zip}`
      },
    });

    // ✅ Save the order and store the result in a variable
    const savedOrder = await order.save();

    res.status(200).json({
      message: "Order placed successfully",
      orderId: savedOrder._id,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ message: "Failed to store order" });
  }
});

module.exports = router;
