const Joi = require('joi')

exports.createBookingSchema = Joi.object({
    table: Joi.string().hex().length(24).required(),
    customerName: Joi.string().trim().min(2).required(),
    membersCount: Joi.number().integer().min(1).required()
})
