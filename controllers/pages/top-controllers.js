const { User, Restaurant, sequelize } = require('../../models')
const helpers = require('../../helpers/auth-helpers')
const topServices = require('../../services/top-services')

const topController = {
  getTopUsers: async (req, res, next) => {
    try {
      topServices.getTopUsers(req, (err, data) => (err ? next(err) : res.render('top-users', data)))
    } catch (err) {
      next(err)
    }
  },
  getTopRestaurants: async (req, res, next) => {
    try {
      topServices.getTopRestaurants(req, (err, data) => (err ? next(err) : res.render('top-restaurants', data)))
    } catch (err) {
      next(err)
    }
  },
}

module.exports = topController
