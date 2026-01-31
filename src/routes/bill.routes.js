const express = require('express')
const router = express.Router()

const { createBill, payBill, getActiveBills, getBillById } = require('../controllers/bill.controller')
const { protect } = require('../middlewares/auth.middleware')
const { allowRoles } = require('../middlewares/role.middleware')
const { ROLES } = require('../utils/constants')

router.use(protect)

router.post(
    '/',
    allowRoles(ROLES.WAITER, ROLES.ADMIN),
    createBill
)

router.patch(
    '/:id/pay',
    allowRoles(ROLES.ADMIN, ROLES.WAITER),
    payBill
)

router.get(
    '/active',
    allowRoles(ROLES.ADMIN, ROLES.WAITER),
    getActiveBills
)

router.get(
    '/:id',
    allowRoles(ROLES.ADMIN, ROLES.WAITER),
    getBillById
)


module.exports = router
