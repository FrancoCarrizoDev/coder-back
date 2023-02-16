const { Router } = require('express')
const cartsController = require('../controllers/carts.controller')

const router = Router()

// Mongoose

// Create cart
router.post('/', cartsController.createCart)

//Cart By ID
router.get('/:cid', cartsController.getCartByID)

//Add Product to Cart ID
router.post('/:cid/product/:pid', cartsController.addCart)

//Delete Product from Cart ID
router.delete('/:cid/product/:pid', cartsController.deleteProductFromCartdID)

//Update Cart by ID
router.put('/:cid', cartsController.updateCartByID)

//Update Product quantity on Cart ID
router.put('/:cid/product/:pid', cartsController.updateProductQuantityByCartID)


module.exports = router
