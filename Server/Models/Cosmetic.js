const mongoose = require('mongoose')
const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    rating: Number,
    stock: Number,
    image: String
})

const CosmeticModel = mongoose.model('cosmetics',ProductSchema)
module.exports = CosmeticModel