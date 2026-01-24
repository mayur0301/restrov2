const Joi = require('joi')

const objectId = Joi.string().hex().length(24)

exports.idParamSchema = Joi.object({
  id: objectId.required()
})

exports.categoryIdParamSchema = Joi.object({
  categoryId: objectId.required()
})