const Category = require('../models/Category')

// CREATE
exports.createCategory = async (req, res) => {
    const name = req.body.name.toLowerCase()

    const existing = await Category.findOne({ name })
    if (existing) {
        return res.status(400).json({ message: 'Category already exists' })
    }

    const category = await Category.create({ name })
    res.status(201).json(category)
}


// READ ALL
exports.getCategories = async (req, res) => {
    const categories = await Category.find()
    res.json({ success: true, data: { categories } })
}

// UPDATE
exports.updateCategory = async (req, res) => {
    const { id } = req.params
    const name = req.body.name.toLowerCase()

    const category = await Category.findById(id)
    if (!category) {
        return res.status(404).json({ message: 'Category not found' })
    }

    category.name = name
    await category.save()

    res.json(category)
}

// DELETE (hard delete)
exports.deleteCategory = async (req, res) => {
    const { id } = req.params

    const category = await Category.findById(id)
    if (!category) {
        return res.status(404).json({ message: 'Category not found' })
    }

    await category.deleteOne()
    res.json({ message: 'Category deleted' })
}
