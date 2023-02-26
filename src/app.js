require('dotenv').config()
const express = require('express')
const cartsRouter = require('./routes/carts.router')
const productRouter = require('./routes/products.router')
const viewsRouter = require('./routes/views.router')
const chatsRouter = require('./routes/chats.router')
const sessionRouter = require('./routes/session.router')
const handlebars = require('express-handlebars')
const { connectSocket } = require('./utils/socket.io')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const PORT = 8080
const app = express()

//Express
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

//Cookies
app.use(cookieParser(process.env.COOKIE_SECRET))

//Session
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: true,
	})
)

//Routes
app.use('/api/products', productRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/chats', chatsRouter)
app.use('/', viewsRouter)
app.use('/api/session', sessionRouter)

//Socket io
const httpServer = app.listen(PORT, () => {
	console.log(`Servidor corriendo en puerto ${PORT}`)
})

connectSocket(httpServer)

//Mongoose
mongoose.set('strictQuery', false)
mongoose.connect(
	`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/?retryWrites=true&w=majority`,
	(error) => {
		if (error) {
			console.log(
				`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/?retryWrites=true&w=majority`
			)
			console.log('Error de conexión. ', error)
			process.exit()
		} else {
			console.log('Conexión con base de datos exitosa')
		}
	}
)
