const mongoose = require('mongoose')
const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    rating: Number,
    stock: Number,
    image: String
})

const GroceryModel = mongoose.model('grocery',ProductSchema)
module.exports = GroceryModel