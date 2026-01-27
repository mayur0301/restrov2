const express = require('express')
const router = express.Router()


const {
  createTable,
  getTables,
  deleteTable,
  bookTable,
  unbookTable
} = require('../controllers/table.controller')

const { protect } = require('../middlewares/auth.middleware')
const { isAdmin, isWaiter } = require('../middlewares/role.middleware')

const validateParams = require('../middlewares/validateParams')
const { idParamSchema } = require('../validations/common.validation')

router.use(protect)

router.post('/', isAdmin,createTable)
router.get('/', isAdmin, isWaiter,getTables)
//router.get('/waiter', isWaiter,getTables)
//router.patch('/:id/book', bookTable)
//router.patch('/:id/unbook', unbookTable)
//router.delete('/:id', deleteTable)
router.patch(
  '/:id/unbook',
  isAdmin,
  validateParams(idParamSchema),
  unbookTable
)

router.delete(
  '/:id',
  isAdmin,
  validateParams(idParamSchema),
  deleteTable
)


module.exports = router
