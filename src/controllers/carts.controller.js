const CartsManagerMongo = require('../dao/Mongo Manager/cartsManagerMongo')

const createCart = async (req, res) => {
	try {
		const { products = [] } = req.body
		const cartAdded = await CartsManagerMongo.createCart(products)
		return res.json({
			msg: 'OK',
			payload: cartAdded,
		})
	} catch (error) {
		return res.status(500).json({
			msg: 'Error',
			payload: error.message,
		})
	}
}

const getCartByID = async (req, res) => {
	try {
		const cid = req.params.cid
		const cartFound = await CartsManagerMongo.getCartByID(cid)
		return res.json({
			msg: 'OK',
			payload: cartFound,
		})
	} catch (error) {
		return res.status(500).json({
			msg: 'Error',
			payload: error.message,
		})
	}
}

const addCart = async (req, res) => {
	try {
		const { cid, pid } = req.params

		let cart = await CartsManagerMongo.getCartByID(cid)

		// si no hay carrito, error, no se puede agregar un producto a un carrito vacio
		if (cart) {
			return res.status(400).json({
				mg: 'Error',
				payload: 'El carrito ya existe, usar api put',
			})
		}

		cart.products.push({ product: pid, quantity: 1 })

		const payload = await CartsManagerMongo.updateProductInCart(cid, cart)

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

const deleteProductFromCartdID = async (req, res) => {
	try {
		const { cid, pid } = req.params

		const cart = await CartsManagerMongo.getCartByID(cid)
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

		await CartsManagerMongo.deleteProductInCart(cid, pid, cart)

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

const updateCartByID = async (req, res) => {
	try {
		const { cid } = req.params
		const products = req.body
		await CartsManagerMongo.updateCartByID(cid, products)
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

const updateProductQuantityByCartID = async (req, res) => {
	try {
		const { cid, pid } = req.params
		const product = req.body
		const quantity = product.quantity
		await CartsManagerMongo.updateProductQuantityByCartID(cid, pid, quantity)
	} catch (error) {}
}

module.exports = {
	createCart,
	addCart,
	getCartByID,
	addProductToCartID: addCart,
	deleteProductFromCartdID,
	updateCartByID,
	updateProductQuantityByCartID,
}