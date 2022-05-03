const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant, sequelize } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck)
      throw new Error('Passwords do not match!')
    User.findOne({ where: { email: req.body.email } })
      .then((user) => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then((hash) =>
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash,
        })
      )
      .then(() => {
        req.flash('success_messages', 'Sign up successfully!')
        res.redirect('/signin')
      })
      .catch((err) => next(err))
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
  getUsers: (req, res, next) => {
    return User.findAll({ raw: true })
      .then((users) => res.render('admin/users', { users }))
      .catch((err) => next(err))
  },
  patchUser: (req, res, next) => {
    const userId = req.params.id
    return User.findByPk(userId)
      .then((user) => {
        if (!user) throw new Error('User did not exists!')
        if (user.email === 'root@example.com')
          throw new Error(
            'The identity of root@example.com can not be changed!'
          )
        return user.update({ isAdmin: !user.isAdmin })
      })
      .then(() => {
        req.flash(
          'success_messages',
          'Identity of user was changed successfully!'
        )
        res.redirect('/admin/users')
      })
      .catch((err) => next(err))
  },
  getUser: (req, res, next) => {
    const userId = req.params.id

    return User.findByPk(userId)
      .then((user) => {
        if (!user) throw new Error('User did not exists!')
        res.render('user/profile', { user: user.toJSON() })
      })
      .catch((err) => next(err))
  },
  editUser: (req, res, next) => {
    const userId = req.params.id
    return User.findByPk(userId, { raw: true })
      .then((user) => res.render('user/edit', { user }))
      .catch((err) => next(err))
  },
  putUser: (req, res, next) => {
    const userId = req.params.id
    const { name } = req.body
    const { file } = req
    return Promise.all([User.findByPk(userId), imgurFileHandler(file)])
      .then(([user, file]) => {
        if (!user) throw new Error('User did not exists!')
        return user.update({ name, image: file?.link || user.image })
      })
      .then(() => {
        req.flash('success_messages', 'User profile was updated successfully!')
        res.redirect(`/user/${userId}`)
      })
      .catch((err) => next(err))
  },
}

module.exports = userController
