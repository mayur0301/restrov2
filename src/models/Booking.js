const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema(
    {
        table: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Table',
            required: true
        },
        customerName: {
            type: String,
            required: true,
            trim: true
        },
        membersCount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['PENDING', 'ARRIVED', 'COMPLETED'],
            default: 'PENDING'
        },
        // bookingTime: {
        //     type: Date,
        //     default: Date.now
        // },
        // expiresAt: {
        //     type: Date,
        //     required: true
        // },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Booking', bookingSchema)
