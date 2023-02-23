const ProductManagerMongo = require('../dao/mongoManager/productManagerMongo')

const home = async (req, res) => {
	let products = await ProductManagerMongo.getProducts()
	res.render('home', {
		products,
	})
}

const realTimeProdcuts = (req, res) => {
	res.render('realTimeProducts')
}

const products = async (req, res) => {
	const products = await ProductManagerMongo.getProducts()
	res.render('products', {
		products: products.docs.map((product) => {
			return {
				id: product._id,
				title: product.title,
				price: product.price,
				thumbnail: product.thumbnail,
			}
		}),
	})
}

module.exports = {
	home,
	realTimeProdcuts,
	products,
}
