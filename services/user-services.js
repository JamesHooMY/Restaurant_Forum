const { User } = require('../models')
const bcrypt = require('bcryptjs')
const {
  localFileHandler,
  imgurFileHandler,
} = require('../helpers/file-helpers')
const imgur = require('imgur')

const userService = {
  signUp: async (req, cb) => {
    try {
      const { name, email, password, passwordCheck } = req.body
      if (password !== passwordCheck) throw new Error('Passwords do not match!')

      const user = await User.findOne({ where: { email } })
      if (user) throw new Error('Email already exists!')

      const hash = await bcrypt.hash(req.body.password, 10)

      const createdUser = await User.create({
        name: name,
        email: email,
        password: hash,
      })
      delete createdUser.toJSON().password

      return cb(null, createdUser)
    } catch (err) {
      cb(err)
    }
  },
}
module.exports = userService
