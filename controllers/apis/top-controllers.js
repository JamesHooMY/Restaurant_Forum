const { User, Restaurant, sequelize } = require('../../models')
const helpers = require('../../helpers/auth-helpers')
const topServices = require('../../services/top-services')

const topController = {
  getTopUsers: async (req, res, next) => {
    try {
      topServices.getTopUsers(req, (err, data) => (err ? next(err) : res.status(200).json({ status: 'success', data })))
    } catch (err) {
      next(err)
    }
  },
  getTopRestaurants: async (req, res, next) => {
    try {
      topServices.getTopRestaurants(req, (err, data) => (err ? next(err) : res.status(200).json({ status: 'success', data })))
    } catch (err) {
      next(err)
    }
  },
}

module.exports = topController
