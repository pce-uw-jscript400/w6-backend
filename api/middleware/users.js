const User = require('../models/user')

const validate = async (req, _res, next) => {
  try {
    const user = new User(req.body)
    await user.validateSync()
    next()
  } catch (e) {
    e.status = 422
    next(e)
  }
}

module.exports = { validate }
