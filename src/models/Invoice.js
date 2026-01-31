const mongoose = require('mongoose')

const invoiceSchema = new mongoose.Schema(
    {
        bill: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bill',
            required: true,
            unique: true
        },
        table: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Table',
            required: true
        },
        totalAmount: {
            type: Number,
            required: true
        },
        generatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Invoice', invoiceSchema)
