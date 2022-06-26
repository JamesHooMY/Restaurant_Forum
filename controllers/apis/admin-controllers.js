const adminServices = require('../../services/admin-services')

const adminController = {
  getRestaurants: async (req, res, next) => {
    adminServices.getRestaurants(req, (err, data) => (err ? next(err) : res.status(200).json({ status: 'success', data })))
  },
  getRestaurant: async (req, res, next) => {
    adminServices.getRestaurant(req, (err, data) => (err ? next(err) : res.status(200).json({ status: 'success', data })))
  },
  postRestaurant: async (req, res, next) => {
    adminServices.postRestaurant(req, (err, data) => (err ? next(err) : res.status(200).json({ status: 'success', data })))
  },
  deleteRestaurant: async (req, res, next) => {
    adminServices.deleteRestaurant(req, (err, data) => (err ? next(err) : res.status(200).json({ status: 'success', data })))
  },
  putRestaurant: async (req, res, next) => {
    adminServices.putRestaurant(req, (err, data) => (err ? next(err) : res.status(200).json({ status: 'success', data })))
  },
}

module.exports = adminController
