const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const app = express()    

app.use(express.json({}))
app.use(express.json({
    extended: true
}))

dotenv.config({
    path : './config/config.env'
})

connectDB()

app.use('/api/todo/auth', require('./routes/user'))
app.use('/api/todo', require('./routes/todo'))
app.use('/api/todo', require('./routes/cart_my'))


const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running on port: ${PORT}`))