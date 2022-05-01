const { Restaurant, Category } = require('../models')

const restController = {
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category],
      paranoid: true,
    })
      .then((restaurants) => {
        const data = restaurants.map((restaurant) => ({
          ...restaurant,
          description: restaurant.description.substring(0, 50),
          // replace the description with limited 50 substring
        }))
        res.render('restaurants', { restaurants })
      })
      .catch((err) => next(err))
  },
}

module.exports = restController
