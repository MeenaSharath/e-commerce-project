const mongoose = require('mongoose')
const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    rating: Number,
    stock: Number,
    image: String
})

const FashionModel = mongoose.model('fashion',ProductSchema)
module.exports = FashionModel