require('dotenv').config()
const express = require('express')
const cartsRouter = require('./routes/carts.router')
const productRouter = require('./routes/products.router')
const viewsRouter = require('./routes/views.router')
const chatsRouter = require('./routes/chats.router')
const handlebars = require('express-handlebars')
const { connectSocket } = require('./utils/socket.io')
const mongoose = require('mongoose')
const PORT = 8080
const server = express()

//Express
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

//Handlebars
server.engine('handlebars', handlebars.engine())
server.set('views', __dirname + '/views')
server.set('view engine', 'handlebars')
server.use(express.static(__dirname + '/public'))

//Routes
server.use('/api/products', productRouter)
server.use('/api/carts', cartsRouter)
server.use('/api/chats', chatsRouter)
server.use('/', viewsRouter)

//Socket io
const httpServer = server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})

connectSocket(httpServer)

//Mongoose
mongoose.set('strictQuery', false)
mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/?retryWrites=true&w=majority`,
  (error) => {
    if (error) {
      console.log(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/?retryWrites=true&w=majority`)
      console.log('Error de conexión. ', error)
      process.exit()
    } else {
      console.log('Conexión con base de datos exitosa')
    }
  }
)
