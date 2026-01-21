const mongoose = require('mongoose')
const { TABLE_STATUS } = require('../utils/constants')

const tableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    status: {
      type: String,
      enum: Object.values(TABLE_STATUS),
      default: TABLE_STATUS.FREE
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Table', tableSchema)
