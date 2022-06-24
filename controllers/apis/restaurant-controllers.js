const restaurantServices = require('../../services/restaurant-services')

const restController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, data) => (err ? next(err) : res.json({ status: 'success', data })))
  },
  getRestaurant: (req, res, next) => {
    restaurantServices.getRestaurant(req, (err, data) => (err ? next(err) : res.status(200).json({ status: 'success', data })))
  },
  getNews: (req, res, next) => {
    restaurantServices.getNews(req, (err, data) => (err ? next(err) : res.status(200).json({ status: 'success', data })))
  },
}

module.exports = restController
