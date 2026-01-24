const express = require('express')
const router = express.Router()

const {
    createBooking,
    markArrival,
    getAllBookings,
    getActiveBookings,
    getBookingById
} = require('../controllers/booking.controller')

const { protect } = require('../middlewares/auth.middleware')
const { isAdmin } = require('../middlewares/role.middleware')
const validate = require('../middlewares/validate')
const validateParams = require('../middlewares/validateParams')
const { idParamSchema } = require('../validations/common.validation')
const { createBookingSchema } = require('../validations/booking.validation')

// admin only
router.use(protect, isAdmin)

// create booking
//router.post('/', createBooking)
router.post(
    '/',
    validate(createBookingSchema),
    createBooking
)
router.get('/', getAllBookings)
router.get('/active', getActiveBookings)
//router.get('/:id', getBookingById)
router.get(
    '/:id',
    validateParams(idParamSchema),
    getBookingById
)
//router.patch('/:id/arrive', markArrival)
router.patch(
    '/:id/arrive',
    validateParams(idParamSchema),
    markArrival
)


module.exports = router
