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
const { isAdmin, isWaiter } = require('../middlewares/role.middleware')

const validateParams = require('../middlewares/validateParams')
const { idParamSchema, categoryIdParamSchema } = require('../validations/common.validation')

router.use(protect)

router.post('/', isAdmin,createDish)
router.get('/', isAdmin,getDishes)
router.get('/waiter', isWaiter,getDishes)

// router.put('/:id', updateDish)
// router.delete('/:id', deleteDish)
// router.get('/category/:categoryId', getDishesByCategory)
router.put(
  '/:id',
  isAdmin,
  validateParams(idParamSchema),
  updateDish
)

router.delete(
  '/:id',
  isAdmin,
  validateParams(idParamSchema),
  deleteDish
)

router.get(
  '/category/:categoryId',
  validateParams(categoryIdParamSchema),
  getDishesByCategory
)


module.exports = router
