const { Restaurant, Category, Comment, User, Like } = require('../../models')
const { getOffset, getPagination } = require('../../helpers/pagination-helper')
const restaurantServices = require('../../services/restaurant-services')

const restController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, data) => (err ? next(err) : res.render('restaurants', data)))
  },
  getRestaurant: async (req, res, next) => {
    restaurantServices.getRestaurant(req, (err, data) => (err ? next(err) : res.render('restaurant', data)))
  },
  getNews: async (req, res, next) => {
    restaurantServices.getNews(req, (err, data) => (err ? next(err) : res.render('news', data)))
  },
}

module.exports = restController
