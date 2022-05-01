const { Restaurant, Category } = require('../models')

const restController = {
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category],
    })
      .then((restaurants) => {
        if (!restaurants) throw new Error('Restaurant is not exist!')
        const data = restaurants.map((restaurant) => ({
          ...restaurant,
          description: restaurant.description.substring(0, 50),
          // replace the description with limited 50 substring
        }))
        res.render('restaurants', { restaurants })
      })
      .catch((err) => next(err))
  },
  getRestaurant: (req, res, next) => {
    const restaurantId = req.params.id
    return Restaurant.findByPk(restaurantId, {
      raw: true,
      nest: true,
      include: [Category],
    })
      .then((restaurant) => {
        if (!restaurant) throw new Error('Restaurant is not exist!')
        res.render('restaurant', { restaurant })
      })
      .catch((err) => next(err))
  },
}

module.exports = restController
