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
const { isAdmin } = require('../middlewares/role.middleware')

router.use(protect, isAdmin)

router.post('/', createTable)
router.get('/', getTables)
router.patch('/:id/book', bookTable)
router.patch('/:id/unbook', unbookTable)
router.delete('/:id', deleteTable)

module.exports = router
