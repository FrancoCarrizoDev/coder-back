const mongoose = require('mongoose')

const cartsCollection = 'User'

const cartsSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique:true,
        
      },
      password: {
        type: String,
        required: true,
      },
      rol: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
      },
})

const CartsModel = mongoose.model(cartsCollection, cartsSchema)

module.exports = CartsModel
