const jwt = require('jsonwebtoken')
const userServices = require('../../services/user-services')

const userController = {
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => (err ? next(err) : res.status(201).json({ status: 'success', data })))
  },
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password

      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d',
      })
      return res.status(200).json({ status: 'success', data: { token, user: userData } })
    } catch (err) {
      next(err)
    }
  },
  getUsers: (req, res, next) => {
    try {
      userServices.getUsers(req, (err, data) => (err ? next(err) : res.status(200).json({ status: 'success', data })))
    } catch (err) {
      next(err)
    }
  },
  patchUser: (req, res, next) => {
    try {
      userServices.patchUser(req, (err, data) => (err ? next(err) : res.status(200).json({ status: 'success', data })))
    } catch (err) {
      next(err)
    }
  },
  getUser: (req, res, next) => {
    try {
      userServices.getUser(req, (err, data) => {
        if (err) return next(err)

        // data.user = data.queryUser
        // delete data.queryUser
        delete Object.assign(data, { user: data.queryUser })['queryUser']

        return res.status(200).json({ status: 'success', data })
      })
    } catch (err) {
      next(err)
    }
  },
  putUser: (req, res, next) => {
    try {
      userServices.putUser(req, (err, data) => (err ? next(err) : res.status(200).json({ status: 'success', data })))
    } catch (err) {
      next(err)
    }
  },
  addFavorite: (req, res, next) => {
    try {
      userServices.addFavorite(req, (err, data) => (err ? next(err) : res.status(200).json({ status: 'success', data })))
    } catch (err) {
      next(err)
    }
  },
  deleteFavorite: (req, res, next) => {
    try {
      userServices.deleteFavorite(req, (err, data) => (err ? next(err) : res.status(200).json({ status: 'success', data })))
    } catch (err) {
      next(err)
    }
  },
  addLike: (req, res, next) => {
    try {
      userServices.addLike(req, (err, data) => (err ? next(err) : res.status(200).json({ status: 'success', data })))
    } catch (err) {
      next(err)
    }
  },
  deleteLike: (req, res, next) => {
    try {
      userServices.deleteLike(req, (err, data) => (err ? next(err) : res.status(200).json({ status: 'success', data })))
    } catch (err) {
      next(err)
    }
  },
}

module.exports = userController
