const { Router } = require('express')
const viewsController = require('../controllers/views.controller')

const router = Router()

router.get('/', viewsController.home)

router.get('/realTimeProducts', viewsController.realTimeProdcuts)

router.get('/products', viewsController.products)

module.exports = router
