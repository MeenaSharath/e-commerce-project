const mongoose = require('mongoose')
const ProductSchema = new mongoose.Schema({
    name: String,
    des: String,
    price: Number,
    off: Number,
    rating: Number,
    image: String
})

const OffersModel = mongoose.model('offers',ProductSchema)
module.exports = OffersModel