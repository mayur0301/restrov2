const express = require('express')
const router = express.Router()

const validate = require('../middlewares/validate')

const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} = require('../controllers/category.controller')

const {
  createCategorySchema,
  updateCategorySchema
} = require('../validations/category.validation')

const { idParamSchema } = require('../validations/common.validation')

const { protect } = require('../middlewares/auth.middleware')

const { isAdmin, isWaiter } = require('../middlewares/role.middleware')

const validateParams = require('../middlewares/validateParams')

router.use(protect)

router.post('/', isAdmin, validate(createCategorySchema), createCategory)

router.get('/', isAdmin, getCategories)

router.get('/waiter', isWaiter, getCategories)

router.put('/:id', isAdmin, validateParams(idParamSchema), validate(updateCategorySchema), updateCategory)

router.delete('/:id', isAdmin
  , validateParams(idParamSchema), deleteCategory)

module.exports = router
