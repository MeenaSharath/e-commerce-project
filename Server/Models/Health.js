const mongoose = require('mongoose')
const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    rating: Number,
    stock: Number,
    image: String
})

const HealthModel = mongoose.model('health',ProductSchema)
module.exports = HealthModel