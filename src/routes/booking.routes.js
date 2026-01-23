const express = require('express')
const router = express.Router()

const {
    createBooking,
    markArrival
} = require('../controllers/booking.controller')

const { protect } = require('../middlewares/auth.middleware')
const { isAdmin } = require('../middlewares/role.middleware')

// admin only
router.use(protect, isAdmin)

// create booking
router.post('/', createBooking)
router.patch('/:id/arrive', markArrival)


module.exports = router
