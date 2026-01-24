const express = require('express')
const router = express.Router()
const { register, login } = require('../controllers/auth.controller')
const { protect } = require('../middlewares/auth.middleware')
const {logout} = require('../controllers/auth.controller')

router.post('/register', register)
router.post('/login', login)
router.post('/logout', protect, logout)

module.exports = router
