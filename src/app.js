const express = require('express')
const app = express()

app.use(express.json())

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/categories', require('./routes/category.routes'))
app.use('/api/dishes', require('./routes/dish.routes'))


module.exports = app
