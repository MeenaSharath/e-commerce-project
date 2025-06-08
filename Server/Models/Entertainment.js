const mongoose = require('mongoose')
const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    rating: Number,
    stock: Number,
    image: String
})

const EntertainmentModel = mongoose.model('entertainment',ProductSchema)
module.exports = EntertainmentModel