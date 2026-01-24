const Joi = require('joi')

exports.createCategorySchema = Joi.object({
    name: Joi.string().trim().min(3).required()
})

exports.updateCategorySchema = Joi.object({
    name: Joi.string().trim().min(3).required()
})
