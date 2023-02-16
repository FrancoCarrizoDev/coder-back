const { calculateCartTotal, mapProductCart } = require('../../utils/calculateCartPrices')
const CartsModel = require('../models/carts.model')


class CartsManagerMongo {
	getCartByID = async (id) => {
		return await CartsModel.findById(id).populate('products.product')
	}

	getAllCarts = async () => {
		return await CartsModel.find()
	}

	createCart = async (products) => {
		let productsToAdd = await mapProductCart(products)

		const newCart = {
			totalPrice: calculateCartTotal(productsToAdd),
			totalQuantity: productsToAdd.length,
			products: productsToAdd,
		}

		const newCartSaved = await CartsModel.create(newCart)
		return newCartSaved
	}

	addCart = async (cid, pid) => {
		const productToUpdate = await this.findProductOnCartID(cid, pid)
		if (productToUpdate) {
			console.log('encontrado')
			productToUpdate.quantity++
		} else {
			console.log('no encontrado')
			products.products.push({
				products: [
					{
						products: `${pid}`,
						quantity: 1,
					},
				],
			})
		}
		console.log('products 2', products)
		return this.updateCartByID(cid, products)
	}

	deleteProductInCart = async (cid, pid, cart) => {
		cart.products = cart.products.filter(({ product }) => product._id != pid)
		cart.totalQuantity = cart.products.length
		cart.totalPrice = calculateCartTotal(cart.products)

		const saveCart = await CartsModel.updateOne({ _id: cid }, cart, { new: true })

		return saveCart
	}

	updateCartByID = async (cid, products) => {
		const productToUpdate = await mapProductCart(products)
		const newCart = {
			totalPrice: calculateCartTotal(productToUpdate),
			totalQuantity: productToUpdate.length,
			products: productToUpdate,
		}
		const updated = await CartsModel.updateOne({ _id: cid }, newCart)
		return updated
	}

	updateProductInCart = async (cid, cart) => {
		const cartUpdated = await CartsModel.updateOne({ _id: cid }, cart)
		return cartUpdated
	}
}

module.exports = new CartsManagerMongo()
