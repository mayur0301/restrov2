const AppError = require('../utils/AppError')

// 🔹 Handle invalid Mongo ObjectId
const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

// 🔹 Handle duplicate key error
const handleDuplicateFieldsDB = err => {
    const field = Object.keys(err.keyValue)[0]
    const value = err.keyValue[field]
    const message = `Duplicate value for ${field}: "${value}"`
    return new AppError(message, 400)
}

// 🔹 Handle mongoose validation errors
const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message)
    const message = `Invalid input data. ${errors.join('. ')}`
    return new AppError(message, 400)
}

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    // DEV
    if (process.env.NODE_ENV !== 'production') {
        console.error('🔥 ERROR:', {
            message: err.message,
            stack: err.stack,
            path: req.originalUrl,
            method: req.method
        })

        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: err.stack
        })
    }

    // PROD
    // PROD
    let error = { ...err }
    error.message = err.message

    // Mongo / Mongoose error handling
    if (error.name === 'CastError') {
        error = handleCastErrorDB(error)
    }

    if (error.code === 11000) {
        error = handleDuplicateFieldsDB(error)
    }

    if (error.name === 'ValidationError') {
        error = handleValidationErrorDB(error)
    }

    if (error.isOperational) {
        return res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        })
    }

    console.error('💥 UNEXPECTED ERROR:', err)

    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
    })

}

module.exports = errorHandler
