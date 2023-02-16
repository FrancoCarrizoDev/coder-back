const CartsManagerMongo = require('../dao/mongoManager/cartsManagerMongo')
const ProductManagerMongo = require('../dao/mongoManager/cartsManagerMongo')
const { mapProductCart } = require('../utils/calculateCartPrices')

const createCart = async (req, res) => {
	try {
		const { products = [] } = req.body

		let { productCartList, productsNotFound } = await mapProductCart(products)
		const newCart = {
			totalPrice: calculateCartTotal(products),
			totalQuantity: products.length,
			products: products,
		}
		await CartsManagerMongo.create(productCartList)
		return res.json({
			msg: 'OK',
			payload: { newCart, productsNotFound },
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

const createCartAndAddAProduct = async (req, res) => {
	try {
		const { cid, pid } = req.params

		let cart = await CartsManagerMongo.getById(cid)

		if (cart) {
			return res.status(400).json({
				mg: 'Error',
				payload: 'El carrito ya existe, usar api put',
			})
		}

		const productInDB = ProductManagerMongo.getById(pid)

		if(!productInDB){
			return res.status(400).json({
				mg: 'Error',
				payload: `El producto con el id ${pid} no existe`,
			})
		}

		cart.products.push({ product: pid, quantity: 1 })

		const payload = await CartsManagerMongo.updateCart(cid, cart)

		res.json({
			msg: 'OK',
			payload,
		})
	} catch (error) {
		return res.status(500).json({
			msg: 'Error',
			payload: error.message,
		})
	}
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

		const existsProductInCart = cart.products.some(({ product }) => product._id == pid)

		if (!existsProductInCart) {
			return res.status(400).json({
				msg: `El producto con el id ${pid} no existe`,
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
			totalPrice: calculateCartTotal(products),
			totalQuantity: products.length,
			products: products,
		}

		await CartsManagerMongo.updateCart(cid, cartUpdated)

		res.json({
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

		await CartsManagerMongo.updateProductInCart(cid, cart)

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
	createCartAndAddAProduct,
	deleteProduct,
	updateAllProducts,
	updateProductQuantity,
}
