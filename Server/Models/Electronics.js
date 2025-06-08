const mongoose = require('mongoose')
const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    rating: Number,
    stock: Number,
    image: String
})

const ElectronicsModel = mongoose.model('electronics',ProductSchema)
module.exports = ElectronicsModel