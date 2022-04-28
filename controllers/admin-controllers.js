const { Restaurant } = require('../models')

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true })
      .then((restaurants) => res.render('admin/restaurants', { restaurants }))
      .catch((err) => console.log(err))
  },
}

module.exports = adminController
