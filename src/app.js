const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const AppError = require('./utils/AppError')
const errorHandler = require('./middlewares/errorMiddleware')
const cors = require('cors')
const requestLogger = require('./middlewares/requestLogger')

app.use(cors({
    origin: ["http://localhost:5173",
        "https://chilli-chhat.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"]
}))

app.use(express.json())
app.use(cookieParser())

// 🔍 Request logging (dev-friendly)
app.use(requestLogger)

//Routes
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/categories', require('./routes/category.routes'))
app.use('/api/dishes', require('./routes/dish.routes'))
app.use('/api/tables', require('./routes/table.routes'))
app.use('/api/orders', require('./routes/order.routes'))
app.use('/api/bookings', require('./routes/booking.routes'))

// 🚫 HANDLE UNKNOWN ROUTES (must be AFTER routes)
app.use((req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl}`, 404))
})


// 🔥 GLOBAL ERROR HANDLER (must be LAST)
app.use(errorHandler)

module.exports = app
