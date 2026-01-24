const express = require('express')
const router = express.Router()


const {
  createDish,
  getDishes,
  updateDish,
  deleteDish,
  getDishesByCategory
} = require('../controllers/dish.controller')

const { protect } = require('../middlewares/auth.middleware')
const { isAdmin } = require('../middlewares/role.middleware')

const validateParams = require('../middlewares/validateParams')
const { idParamSchema, categoryIdParamSchema } = require('../validations/common.validation')

router.use(protect, isAdmin)

router.post('/', createDish)
router.get('/', getDishes)

// router.put('/:id', updateDish)
// router.delete('/:id', deleteDish)
// router.get('/category/:categoryId', getDishesByCategory)
router.put(
  '/:id',
  validateParams(idParamSchema),
  updateDish
)

router.delete(
  '/:id',
  validateParams(idParamSchema),
  deleteDish
)

router.get(
  '/category/:categoryId',
  validateParams(categoryIdParamSchema),
  getDishesByCategory
)


module.exports = router
