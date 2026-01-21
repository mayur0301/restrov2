const express = require('express')
const router = express.Router()

const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} = require('../controllers/category.controller')

const { protect } = require('../middlewares/auth.middleware')
const { isAdmin } = require('../middlewares/role.middleware')

router.use(protect, isAdmin)

router.post('/', createCategory)
router.get('/', getCategories)
router.put('/:id', updateCategory)
router.delete('/:id', deleteCategory)

module.exports = router
