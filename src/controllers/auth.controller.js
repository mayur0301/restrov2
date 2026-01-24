const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// REGISTER (admin will usually create users later, but we keep this clean)
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' })
  }

  const user = await User.create({ name, email, password, role })

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  })
}

// LOGIN
// exports.login = async (req, res) => {
//   const { email, password } = req.body

//   const user = await User.findOne({ email })
//   if (!user) {
//     return res.status(400).json({ message: 'Invalid credentials' })
//   }

//   const isMatch = await user.comparePassword(password)
//   if (!isMatch) {
//     return res.status(400).json({ message: 'Invalid credentials' })
//   }

//   res.json({
//     message: 'Login successful',
//     user: {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role
//     },
//     token: generateToken(user)
//   })
// }

exports.login = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' })
  }

  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' })
  }

  const token = generateToken(user)

  // 🍪 SET COOKIE
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,        // 🔥 MUST be true in prod
    sameSite: 'none',    // 🔥 MUST be 'none' for cross-site
    maxAge: 7 * 24 * 60 * 60 * 1000
  })


  res.json({
    message: 'Login successful',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token, // still returned (for non-browser clients)
  })
}

//Logout
exports.logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'none',
    secure: true // true in prod
  })

  res.json({
    success: true,
    message: 'Logged out successfully'
  })
}

