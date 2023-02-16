const { Router } = require('express')
const ProductsModel = require('../dao/models/products.model')
const ProductManager = require('../dao/fileSystemManager/productManager')
const ChatsManagerMongo = require('../dao/mongoManager/chatsManagerMongo')

const router = Router()
const path = './src/assets/Products.json' //ponerle dirname
const productManager = new ProductManager(path)

router.get('/', async (req, res) => {
  const products = await productManager.getProducts()
  res.render('home', {
    products,
  })
})

router.get('/realTimeProducts', async (req, res) => {
  res.render('realTimeProducts')
})

router.get('/products', async (req, res) => {
  const products = await ProductsModel.find()
  res.render('products', {
    //unstructured product due to Mongo ._id is an object which will not be recognized by Handlebars
    products: products.map((product) => {
      return {
        id: product._id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
      }
    }),
  })
})

router.get('/chats', async (req, res) => {
  const chats = await ChatsManagerMongo.getMessages()
  res.render('chat')
})

module.exports = router
