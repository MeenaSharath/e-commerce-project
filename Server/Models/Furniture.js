const mongoose = require('mongoose')
const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    rating: Number,
    stock: Number,
    image: String
})

const ProductModel = mongoose.model('furniture',ProductSchema)
module.exports = ProductModel