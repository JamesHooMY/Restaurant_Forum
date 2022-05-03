const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant, sequelize } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    try {
      const { name, email, password, passwordCheck } = req.body
      if (password !== passwordCheck) throw new Error('Passwords do not match!')

      const user = await User.findOne({ where: { email: req.body.email } })
      if (user) throw new Error('Email already exists!')

      const hash = await bcrypt.hash(req.body.password, 10)

      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      })

      req.flash('success_messages', 'Sign up successfully!')
      return res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'Sign in successfully!')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Logout successfully!')
    req.logout()
    res.redirect('/signin')
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({ raw: true })
      if (!users) throw new Error('Users do not exists!')

      return res.render('admin/users', { users })
    } catch (err) {
      next(err)
    }
  },
  patchUser: async (req, res, next) => {
    try {
      const userId = req.params.id

      const user = await User.findByPk(userId)
      if (!user) throw new Error('User did not exists!')
      if (user.email === 'root@example.com')
        throw new Error('The identity of root@example.com can not be changed!')

      await user.update({ isAdmin: !user.isAdmin })

      req.flash(
        'success_messages',
        'Identity of user was changed successfully!'
      )
      return res.redirect('/admin/users')
    } catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const userId = req.params.id

      const user = await User.findByPk(userId)
      if (!user) throw new Error('User did not exists!')

      return res.render('user/profile', { user: user.toJSON() })
    } catch (err) {
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    try {
      const userId = req.params.id

      const user = await User.findByPk(userId, { raw: true })
      if (!user) throw new Error('User did not exists!')

      return res.render('user/edit', { user })
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      const { name } = req.body

      const [user, file] = await Promise.all([
        User.findByPk(userId),
        imgurFileHandler(req.file),
      ])
      if (!user) throw new Error('User did not exists!')

      if (file?.deletehash && user.deleteHash)
        await imgur.deleteImage(user.deleteHash)
      await user.update({
        name,
        image: file?.link || user.image,
        delehash: file?.deletehash || user.deleteHash,
      })

      req.flash('success_messages', 'User profile was updated successfully!')
      return res.redirect(`/user/${userId}`)
    } catch (err) {
      next(err)
    }
  },
}

module.exports = userController
