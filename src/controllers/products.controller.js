const ProductManagerMongo = require('../dao/mongoManager/productManagerMongo')
const {
	emitDeleteProduct,
	emitAddProduct,
	emitUpdateProduct,
} = require('../utils/socket.io')

const getProducts = async (req, res) => {
	try {
		const { page, limit, sort, ...query } = req.query
		const products = await ProductManagerMongo.getProducts(page, limit, sort, query)
		return res.json({
			status: 'Sucess',
			payload: products,
		})
	} catch (error) {
		return res.status(500).json({
			ok: false,
			msg: 'Error al intentar obtener los productos',
		})
	}
}

const getProductById = async (req, res) => {
	try {
		const pid = req.params.pid
		const productFound = await ProductManagerMongo.getById(pid)
		return res.json({
			msg: 'OK',
			payload: productFound,
		})
	} catch (error) {
		return res.status(500).json({
			ok: false,
			msg: 'Error al intentar obtener el producto',
		})
	}
}

const addProduct = async (req, res) => {
	try {
		const product = req.body
		const productAdded = await ProductManagerMongo.addProduct(product)
		emitAddProduct(productAdded)

		return res.json({
			msg: productAdded,
			ok: true,
		})
		// }
	} catch (error) {
		return res.status(500).json({
			ok: false,
			msg: 'Error al crear el producto',
		})
	}
}

const updateProduct = async (req, res) => {
	try {
		const pid = req.params.pid
		const product = req.body
		await productMangerMongo.updateProduct(pid, product)
		emitUpdateProduct(product)
		return res.json({
			msg: 'Product updated successfully',
			ok: ok,
		})
	} catch (error) {
		return res.status(500).json({
			ok: false,
			msg: 'Error al actualizar el producto',
		})
	}
}

const deleteProduct = async (req, res) => {
	try {
		const pid = req.params.pid
		const deleted = await productMangerMongo.deleteProduct(pid)
		emitDeleteProduct(pid)
		if (deleted) {
			return res.json({
				msg: 'OK',
				payload: 'Product sucessfully deleted',
			})
		} else {
			return res.status(404).json({
				msg: 'ID ${pid} was not found on the products collection',
				ok: false,
			})
		}
	} catch (error) {
		return res.status(500).json({
			ok: false,
			msg: 'Error al eliminar el producto',
		})
	}
}

module.exports = {
	getProducts,
	getProductById,
	addProduct,
	updateProduct,
	deleteProduct,
}
