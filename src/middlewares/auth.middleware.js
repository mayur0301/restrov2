// const jwt = require('jsonwebtoken')
// const User = require('../models/User')

// const protect = async (req, res, next) => {
//   let token

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer ')
//   ) {
//     token = req.headers.authorization.split(' ')[1]
//   }

//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized: token missing' })
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET)

//     const user = await User.findById(decoded.id).select('-password')
//     if (!user) {
//       return res.status(401).json({ message: 'User not found' })
//     }

//     req.user = user
//     next()
//   } catch (err) {
//     return res.status(401).json({ message: 'Unauthorized: invalid token' })
//   }
// }

// module.exports = { protect }


const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.protect = async (req, res, next) => {
  let token

  // 1️⃣ Cookie first (browser)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token
  }
  // 2️⃣ Header fallback (mobile / API)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
