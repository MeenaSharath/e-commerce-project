const mongoose = require("mongoose");

const SalesSchema = new mongoose.Schema({
  orderid: String,
  name: String,
  products: [
    {
      title: String,
      quantity: Number,
      amount: Number,
      paystatus: String
    }
  ],
});

const SalesModel = mongoose.model('sales',SalesSchema)
module.exports = SalesModel;