const express = require("express");
const router = express.Router();
const Order = require("../Models/OrderModel");

router.post("/api/return/:id", async (req, res) => {
  try {
    const { itemTitle, returnReason } = req.body;
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(
  id,
  { returnReason },
  { new: true }
);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const item = order.cartItems.find(item => item.title === itemTitle);
    if (!item) {
      return res.status(404).json({ message: "Item not found in order" });
    }

    item.returnReason = returnReason;
    await order.save();

    res.status(200).json({ message: "Return reason updated", order });
  } catch (error) {
    console.error("Error updating return reason:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
