const Dish = require('../models/Dish')
const Category = require('../models/Category')

// CREATE
exports.createDish = async (req, res) => {
    try {
        const name = req.body.name.toLowerCase()
        const { price, category, isAvailable } = req.body

        const categoryExists = await Category.findById(category)
        if (!categoryExists) {
            return res.status(404).json({ message: 'Category not found' })
        }

        const dish = await Dish.create({
            name,
            price,
            category,
            isAvailable
        })

        // 🔥 increment dish count
        categoryExists.dishCount += 1
        await categoryExists.save()

        res.status(201).json(dish)
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Dish already exists in this category'
            })
        }

        res.status(500).json({ message: 'Something went wrong' })
    }
}


// READ ALL
exports.getDishes = async (req, res) => {
    const dishes = await Dish.find().populate('category', 'name')
    res.json(dishes)
}

// UPDATE
exports.updateDish = async (req, res) => {
    const { id } = req.params
    const dish = await Dish.findById(id)

    if (!dish) {
        return res.status(404).json({ message: 'Dish not found' })
    }

    if (req.body.name) {
        dish.name = req.body.name.toLowerCase()
    }
    if (req.body.price !== undefined) {
        dish.price = req.body.price
    }
    if (req.body.isAvailable !== undefined) {
        dish.isAvailable = req.body.isAvailable
    }
    if (req.body.category) {
        const categoryExists = await Category.findById(req.body.category)
        if (!categoryExists) {
            return res.status(404).json({ message: 'Category not found' })
        }
        dish.category = req.body.category
    }

    await dish.save()
    res.json(dish)
}

// DELETE (hard delete)
exports.deleteDish = async (req, res) => {
    const { id } = req.params

    const dish = await Dish.findById(id)
    if (!dish) {
        return res.status(404).json({ message: 'Dish not found' })
    }

    const category = await Category.findById(dish.category)

    await dish.deleteOne()

    // 🔥 decrement dish count
    if (category && category.dishCount > 0) {
        category.dishCount -= 1
        await category.save()
    }

    res.json({ message: 'Dish deleted' })
}

exports.getDishesByCategory = async (req, res) => {
  const { categoryId } = req.params

  const dishes = await Dish.find({ category: categoryId })
    .populate('category', 'name')

  res.json(dishes)
}
