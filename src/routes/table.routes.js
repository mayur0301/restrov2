const express = require('express')
const router = express.Router()

const {
  createTable,
  getTables,
  updateTable,
  deleteTable
} = require('../controllers/table.controller')

const { protect } = require('../middlewares/auth.middleware')
const { isAdmin } = require('../middlewares/role.middleware')

router.use(protect, isAdmin)

router.post('/', createTable)
router.get('/', getTables)
router.put('/:id', updateTable)
router.delete('/:id', deleteTable)

module.exports = router
