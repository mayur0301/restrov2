const express = require('express')
const router = express.Router()
const { ROLES } = require('../utils/constants')

const {
    createOrder,
    updateOrderByChef,
    completeOrder,
    getOrders,
    getOrdersForChef,
    getOrdersForWaiter,
    addItemsToOrder
} = require('../controllers/order.controller')

const { protect } = require('../middlewares/auth.middleware')
const { allowRoles } = require('../middlewares/role.middleware')

const validateParams = require('../middlewares/validateParams')
const { idParamSchema } = require('../validations/common.validation')


router.use(protect)

// waiter
router.post('/', allowRoles(ROLES.WAITER, ROLES.ADMIN, ROLES.CHEF), createOrder)
router.put(
    '/:id/complete',
    allowRoles(ROLES.WAITER, ROLES.ADMIN, ROLES.CHEF),
    validateParams(idParamSchema),
    completeOrder
)

// chef
router.put(
    '/:id/status',
    allowRoles(ROLES.WAITER, ROLES.ADMIN, ROLES.CHEF),
    validateParams(idParamSchema),
    updateOrderByChef
)

// shared
router.get('/', 
    allowRoles(ROLES.WAITER, ROLES.ADMIN, ROLES.CHEF),
    getOrders)
router.get('/chef', allowRoles(ROLES.WAITER, ROLES.ADMIN, ROLES.CHEF), getOrdersForChef)
router.get('/waiter', allowRoles(ROLES.WAITER, ROLES.ADMIN, ROLES.CHEF), getOrdersForWaiter)

router.patch(
    '/:id/add-items',
    // protect,
    allowRoles(ROLES.WAITER, ROLES.ADMIN, ROLES.CHEF),
    validateParams(idParamSchema),
    addItemsToOrder
)


module.exports = router
