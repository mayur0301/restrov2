const express = require('express')
const router = express.Router()

const {
    createOrder,
    updateOrderByChef,
    completeOrder,
    getOrders
} = require('../controllers/order.controller')

const { protect } = require('../middlewares/auth.middleware')
const { isWaiter, isChef } = require('../middlewares/role.middleware')

router.use(protect)

// waiter
router.post('/', isWaiter, createOrder)
router.put('/:id/complete', isWaiter, completeOrder)

// chef
router.put('/:id/status', isChef, updateOrderByChef)

// shared
router.get('/', getOrders)

module.exports = router
