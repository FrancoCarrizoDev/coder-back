const { Router } = require('express')
const { login } = require('../controllers/session.controller')

const router = Router()

router.post('/login', login)


module.exports = router
