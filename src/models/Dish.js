const mongoose = require('mongoose')

const dishSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

// prevent duplicate dish names inside same category
dishSchema.index({ name: 1, category: 1 }, { unique: true })

module.exports = mongoose.model('Dish', dishSchema)
