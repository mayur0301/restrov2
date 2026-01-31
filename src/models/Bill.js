const mongoose = require('mongoose')

const billItemSchema = new mongoose.Schema(
    {
        dishId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dish',
            required: true
        },
        dishName: {
            type: String,
            required: true
        },
        unitPrice: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        subtotal: {
            type: Number,
            required: true
        }
    },
    { _id: false }
)

const billSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
            unique: true
        },
        table: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Table',
            required: true
        },
        items: {
            type: [billItemSchema],
            required: true
        },
        totalAmount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['CREATED', 'PAID', 'INVOICED'],
            default: 'CREATED'
        },
        paymentMethod: {
            type: String,
            enum: ['CASH', 'ONLINE']
        },
        paidAt: {
            type: Date
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Bill', billSchema)
