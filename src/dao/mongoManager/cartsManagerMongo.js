const CartsModel = require('../models/carts.model')

class CartsManagerMongo {

	getById = async (id) => {
		return await CartsModel.findById(id).populate('products.product')
	}

	create = async (cart) => {
		return await CartsModel.create(cart)
	}

	updateCart = async (cid, cart) => {
		return await CartsModel.updateOne({ _id: cid }, cart)
	}
}

module.exports = new CartsManagerMongo()
