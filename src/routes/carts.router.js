const { Router } = require('express')
const cartsController = require('../controllers/carts.controller')

const router = Router()

// Mongoose

// Create cart
router.post('/', cartsController.createCart)

//Cart By ID
router.get('/:cid', cartsController.getCart)

//Delete Product from Cart ID
router.delete('/:cid/product/:pid', cartsController.deleteProduct)

//Update Cart by ID
router.put('/:cid', cartsController.updateAllProducts)

//Update Product quantity on Cart ID
router.put('/:cid/product/:pid', cartsController.updateProductQuantity)


module.exports = router
