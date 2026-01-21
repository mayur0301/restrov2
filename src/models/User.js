const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { ROLES } = require('../utils/constants')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
      set: value => value.toUpperCase()
    }
  },
  { timestamps: true }
)

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', userSchema)
