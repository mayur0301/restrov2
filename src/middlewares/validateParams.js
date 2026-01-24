const AppError = require('../utils/AppError')

module.exports = schema => (req, res, next) => {
  const { error } = schema.validate(req.params)

  if (error) {
    return next(new AppError('Invalid ID parameter', 400))
  }

  next()
}
