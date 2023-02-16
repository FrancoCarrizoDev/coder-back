const CartsManagerMongo = require('../dao/mongoManager/cartsManagerMongo')
const ProductManagerMongo = require('../dao/mongoManager/productManagerMongo')
const { mapProductCart, calculateCartTotal } = require('../utils/calculateCartPrices')

const createCart = async (req, res) => {
	try {
		const { products = [] } = req.body

		let { productCartList, productsNotFound } = await mapProductCart(products)
		const cart = {
			totalPrice: calculateCartTotal(productCartList),
			totalQuantity: productCartList.length,
			products: productCartList,
		}
		await CartsManagerMongo.create(cart)
		return res.json({
			msg: 'OK',
			payload: { cart, productsNotFound },
		})
	} catch (error) {
		return res.status(500).json({
			msg: 'Error',
			payload: error.message,
		})
	}
}

const getCart = async (req, res) => {
		const cid = req.params.cid
		const cartFound = await CartsManagerMongo.getById(cid)

		if(cartFound){
			return res.json({
				msg: 'OK',
				payload: cartFound,
			})
		}
		
		return res.status(404).json({
			msg: 'Error',
			payload: `No existe un carrito con el id ${cid}`,
		})
	
}

const deleteProduct = async (req, res) => {
	try {
		const { cid, pid } = req.params

		const cart = await CartsManagerMongo.getById(cid)
		if (!cart) {
			return res.status(400).json({
				msg: `El carrito con el id ${cid} no existe`,
				ok: false,
			})
		}

		// validar si el producto existe en mi DB

		const existsProductInCart = cart.products.some(({ product }) => product._id == pid)

		if (!existsProductInCart) {
			return res.status(400).json({
				msg: `El producto con el id ${pid} no existe en el carrito`,
				ok: false,
			})
		}

		cart.products = cart.products.filter(({ product }) => product._id != pid)
		cart.totalQuantity = cart.products.length
		cart.totalPrice = calculateCartTotal(cart.products)

		await CartsManagerMongo.updateCart(cid, cart)

		res.json({
			msg: 'OK',
			payload: 'Product deleted successfully',
		})
	} catch (error) {
		return res.status(500).json({
			msg: 'Error',
			payload: error.message,
		})
	}
}

const updateAllProducts = async (req, res) => {
	try {
		const { cid } = req.params

		const cart = await CartsManagerMongo.getById(cid)
		if (!cart) {
			return res.status(400).json({
				msg: `El carrito con el id ${cid} no existe`,
				ok: false,
			})
		}

		const { products = [] } = req.body

		const { productCartList, productsNotFound } = await mapProductCart(products)

		const cartUpdated = {
			totalPrice: calculateCartTotal(productCartList),
			totalQuantity: productCartList.length,
			products: productCartList,
		}

		await CartsManagerMongo.updateCart(cid, cartUpdated)

		return res.json({
			msg: productsNotFound.length > 0 ? 'WARNING' : 'OK',
			payload: { productCartList, productsNotFound },
		})
	} catch (error) {
		return res.status(500).json({
			msg: 'Error',
			payload: error.message,
		})
	}
}

const updateProductQuantity = async (req, res) => {
	try {
		const { cid, pid } = req.params
		const { quantity = 0 } = req.body
		const cart = await CartsManagerMongo.getById(cid)
		
		if (!cart) {
			return res.status(400).json({
				msg: `El carrito con el id ${cid} no existe`,
				ok: false,
			})
		}

		const productInDb = await ProductManagerMongo.getById(pid)

		if (!productInDb) {
			return res.status(400).json({
				msg: `El producto con el id ${pid} no existe en base de datos`,
				ok: false,
			})
		}

		const indexProduct = cart.products.findIndex(({ product }) => product._id == pid)

		if (indexProduct === -1) {
			return res.status(400).json({
				msg: `El producto con el id ${pid} no existe en el carrito`,
				ok: false,
			})
		}

		cart.products[indexProduct].quantity += quantity
		
		// volver a calcular el valor del carrito

		await CartsManagerMongo.updateCart(cid, cart)

		res.json({
			msg: 'OK',
			payload: 'Cart updated successfully',
		})
	} catch (error) {
		return res.status(500).json({
			msg: 'Error',
			payload: error.message,
		})
	}
}

module.exports = {
	createCart,
	getCart,
	deleteProduct,
	updateAllProducts,
	updateProductQuantity,
}
