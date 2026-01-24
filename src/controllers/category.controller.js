// const Category = require('../models/Category')

// // CREATE
// exports.createCategory = async (req, res) => {
//     const name = req.body.name.toLowerCase()

//     const existing = await Category.findOne({ name })
//     if (existing) {
//         return res.status(400).json({ message: 'Category already exists' })
//     }

//     const category = await Category.create({ name })
//     res.status(201).json(category)
// }


// // READ ALL
// // exports.getCategories = async (req, res) => {
// //     const categories = await Category.find()
// //     res.json({ success: true, data: { categories } })
// // }
// exports.getCategories = async (req, res) => {
//     const categories = await Category.find().sort({ name: 1 })

//     const data = categories.map((cat) => ({
//         id: cat._id,
//         name: cat.name,        // already normalized (lowercase in DB)
//         dishCount: cat.dishCount,
//         createdAt: cat.createdAt,
//         updatedAt: cat.updatedAt
//     }))

//     res.json({
//         success: true,
//         count: data.length,
//         data
//     })
// }


// // UPDATE
// exports.updateCategory = async (req, res) => {
//     const { id } = req.params
//     const name = req.body.name.toLowerCase()

//     const category = await Category.findById(id)
//     if (!category) {
//         return res.status(404).json({ message: 'Category not found' })
//     }

//     category.name = name
//     await category.save()

//     res.json(category)
// }

// // DELETE (hard delete)
// // exports.deleteCategory = async (req, res) => {
// //     const { id } = req.params

// //     const category = await Category.findById(id)
// //     if (!category) {
// //         return res.status(404).json({ message: 'Category not found' })
// //     }

// //     await category.deleteOne()
// //     res.json({ message: 'Category deleted' })
// // }

// exports.deleteCategory = async (req, res) => {
//     const { id } = req.params

//     const category = await Category.findById(id)
//     if (!category) {
//         return res.status(404).json({ message: 'Category not found' })
//     }

//     // 🔒 critical safety check
//     if (category.dishCount > 0) {
//         return res.status(400).json({
//             message: 'Category has dishes. Remove dishes first.'
//         })
//     }

//     await category.deleteOne()

//     res.json({
//         success: true,
//         message: 'Category deleted successfully'
//     })
// }

const Category = require('../models/Category')
const AppError = require('../utils/AppError')
const catchAsync = require('../utils/catchAsync')

// CREATE
exports.createCategory = catchAsync(async (req, res, next) => {
  const name = req.body.name.toLowerCase()

  const existing = await Category.findOne({ name })
  if (existing) {
    return next(new AppError('Category already exists', 400))
  }

  const category = await Category.create({ name })

  res.status(201).json({
    success: true,
    data: category
  })
})

// READ ALL
exports.getCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find().sort({ name: 1 })

  const data = categories.map(cat => ({
    id: cat._id,
    name: cat.name,
    dishCount: cat.dishCount,
    createdAt: cat.createdAt,
    updatedAt: cat.updatedAt
  }))

  res.status(200).json({
    success: true,
    count: data.length,
    data
  })
})

// UPDATE
exports.updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const name = req.body.name.toLowerCase()

  const category = await Category.findById(id)
  if (!category) {
    return next(new AppError('Category not found', 404))
  }

  category.name = name
  await category.save()

  res.status(200).json({
    success: true,
    data: category
  })
})

// DELETE
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params

  const category = await Category.findById(id)
  if (!category) {
    return next(new AppError('Category not found', 404))
  }

  if (category.dishCount > 0) {
    return next(
      new AppError('Category has dishes. Remove dishes first.', 400)
    )
  }

  await category.deleteOne()

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully'
  })
})
