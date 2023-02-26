const { Router } = require('express')
const viewsController = require('../controllers/views.controller')
const { isAuthenticated } = require('../middleware/isAuth')

const router = Router()

router.get('/', viewsController.home)

router.get('/realTimeProducts', viewsController.realTimeProdcuts)

router.get('/products', isAuthenticated, viewsController.products)

router.get('/login', viewsController.login)

module.exports = router
