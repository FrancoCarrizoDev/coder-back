const mongoose = require('mongoose')

const cartsCollection = 'Carts'

const cartsSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products',
        },
        quantity: Number,
        unitValue: Number
      },
    ],
    default: [],
  },
  totalPrice: Number,
  totalQuantity: Number
})

const CartsModel = mongoose.model(cartsCollection, cartsSchema)

module.exports = CartsModel
