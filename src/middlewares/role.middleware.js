const { ROLES } = require('../utils/constants')

const isAdmin = (req, res, next) => {
  if (req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({ message: 'Admin access only' })
  }
  next()
}

const isWaiter = (req, res, next) => {
  if (req.user.role !== ROLES.WAITER) {
    return res.status(403).json({ message: 'Waiter access only' })
  }
  next()
}

const isChef = (req, res, next) => {
  if (req.user.role !== ROLES.CHEF) {
    return res.status(403).json({ message: 'Chef access only' })
  }
  next()
}

module.exports = {
  isAdmin,
  isWaiter,
  isChef
}
