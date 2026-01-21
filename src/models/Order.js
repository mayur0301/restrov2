const mongoose = require('mongoose')
const { ORDER_STATUS } = require('../utils/constants')

const orderItemSchema = new mongoose.Schema(
  {
    dish: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dish',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      required: true
    },
    items: {
      type: [orderItemSchema],
      required: true
    },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Order', orderSchema)
