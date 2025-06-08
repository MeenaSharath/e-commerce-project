const express = require("express");
const router = express.Router();
const Sales = require("../Models/Sales"); // Assuming you have a model

// POST /salepage
router.post("/", async (req, res) => {
  try {
    const { orderid, name, products} = req.body;
    const newSale = new Sales({ orderid, name, products});
    const savedSale = await newSale.save();
    console.log("Sales stored:", savedSale);
    res.status(201).json({ message: "Sale item saved successfully" });
  } catch (error) {
    console.log("Failed to save sale item");
    res.status(500).json({ error: "Failed to save sale item" });
  }
});

// GET /salepage
router.get("/", async (req, res) => {
  try {
    const sales = await Sales.find();
    console.log("Sales fetched:", sales);
    res.json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ error: "Failed to fetch sale items" });
  }
});

module.exports = router;
