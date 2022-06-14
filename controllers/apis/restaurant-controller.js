const restaurantServices = require('../../services/restaurant-service')

const restController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, data) =>
      err ? next(err) : res.json(data)
    )
  },
}

module.exports = restController
