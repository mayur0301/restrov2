const express = require('express')
const router = express.Router()

const {
    createOrder,
    updateOrderByChef,
    completeOrder,
    getOrders,
    getOrdersForChef,
    getOrdersForWaiter
} = require('../controllers/order.controller')

const { protect } = require('../middlewares/auth.middleware')
const { isWaiter, isChef } = require('../middlewares/role.middleware')

const validateParams = require('../middlewares/validateParams')
const { idParamSchema } = require('../validations/common.validation')


router.use(protect)

// waiter
router.post('/', isWaiter, createOrder)
router.put(
    '/:id/complete',
    validateParams(idParamSchema),
    isWaiter,
    completeOrder
)

// chef
router.put(
    '/:id/status',
    validateParams(idParamSchema),
    isChef,
    updateOrderByChef
)

// shared
router.get('/', getOrders)
router.get('/chef', isChef, getOrdersForChef)
router.get('/waiter', isWaiter, getOrdersForWaiter)


module.exports = router
