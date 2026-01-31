const express = require('express')
const router = express.Router()

const { generateInvoice, getInvoices, getInvoiceById } = require('../controllers/invoice.controller')
const { protect } = require('../middlewares/auth.middleware')
const { allowRoles } = require('../middlewares/role.middleware')
const { ROLES } = require('../utils/constants')

router.use(protect)

router.post(
    '/generate',
    allowRoles(ROLES.ADMIN, ROLES.WAITER),
    generateInvoice
)

router.get(
    '/',
    allowRoles(ROLES.ADMIN),
    getInvoices
)

router.get(
    '/:id',
    allowRoles(ROLES.ADMIN, ROLES.WAITER),
    getInvoiceById
)


module.exports = router
