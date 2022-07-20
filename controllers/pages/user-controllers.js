const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant, Favorite, Like, Followship, sequelize } = require('../../models')
const { imgurFileHandler } = require('../../helpers/file-helpers')
const userServices = require('../../services/user-services')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    try {
      userServices.signUp(req, (err, data) => {
        if (err) return next(err)
        req.flash('success_messages', 'Sign up successfully!')

        res.redirect('/signin')
      })
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
  logout: (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err)
      }
      req.flash('success_messages', 'Logout successfully!')
      res.redirect('/signin')
    })
  },
  getUsers: async (req, res, next) => {
    try {
      userServices.getUsers(req, (err, data) => (err ? next(err) : res.render('admin/users', data)))
    } catch (err) {
      next(err)
    }
  },
  patchUser: async (req, res, next) => {
    try {
      userServices.patchUser(req, (err, data) => {
        if (err) return next(err)
        req.flash('success_messages', `Identity of ${data.name} was changed successfully!`)

        return res.redirect('/admin/users')
      })
    } catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      userServices.getUser(req, (err, data) => (err ? next(err) : res.render('user/profile', data)))
    } catch (err) {
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      if (Number(req.user.id) !== Number(userId)) throw new Error('You are not owner!')

      const user = await User.findByPk(userId, { raw: true })
      if (!user) throw new Error('User did not exists!')

      return res.render('user/edit', { user })
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    try {
      userServices.putUser(req, (err, data) => {
        if (err) return next(err)

        req.flash('success_messages', 'User profile was updated successfully!')
        return res.redirect(`/user/${data.user.id}`)
      })
    } catch (err) {
      next(err)
    }
  },
  addFavorite: async (req, res, next) => {
    try {
      userServices.addFavorite(req, (err, data) => (err ? next(err) : res.redirect('back')))
    } catch (err) {
      next(err)
    }
  },
  deleteFavorite: async (req, res, next) => {
    try {
      userServices.deleteFavorite(req, (err, data) => (err ? next(err) : res.redirect('back')))
    } catch (err) {
      next(err)
    }
  },
  addLike: async (req, res, next) => {
    try {
      userServices.addLike(req, (err, data) => err(err ? next(err) : res.redirect('back')))
    } catch (err) {
      next(err)
    }
  },
  deleteLike: async (req, res, next) => {
    try {
      userServices.deleteLike(req, (err, data) => err(err ? next(err) : res.redirect('back')))
    } catch (err) {
      next(err)
    }
  },
  addFollowing: (req, res, next) => {
    try {
      userServices.addFollowing(req, (err, data) => err(err ? next(err) : res.redirect('back')))
    } catch (err) {
      next(err)
    }
  },
  removeFollowing: (req, res, next) => {
    try {
      userServices.removeFollowing(req, (err, data) => err(err ? next(err) : res.redirect('back')))
    } catch (err) {
      next(err)
    }
  },
}

module.exports = userController
