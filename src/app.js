const express = require('express')
const app = express()

const cors = require('cors')

app.use(cors({
    origin:["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"]
}))

app.use(express.json())

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/categories', require('./routes/category.routes'))
app.use('/api/dishes', require('./routes/dish.routes'))
app.use('/api/tables', require('./routes/table.routes'))
app.use('/api/orders', require('./routes/order.routes'))


module.exports = app
