const mongoose = require('mongoose')
const EmployeeSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const UsersModel = mongoose.model('registerusers',EmployeeSchema)
module.exports = UsersModel