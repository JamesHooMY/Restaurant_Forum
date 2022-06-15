const { Restaurant, Category } = require('../models')
const {
  localFileHandler,
  imgurFileHandler,
} = require('../helpers/file-helpers')
const imgur = require('imgur')

const adminService = {
  getRestaurants: async (req, cb) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category],
      })
      return cb(null, { restaurants })
    } catch (err) {
      cb(err)
    }
  },
  deleteRestaurant: async (req, cb) => {
    try {
      const restaurantId = req.params.id

      const restaurant = await Restaurant.findByPk(restaurantId)
      if (!restaurant) throw new Error('Restaurant is not exist!')

      const deleteRestaurant = await restaurant.destroy()

      req.flash('success_messages', 'restaurant was successfully deleted!')
      return cb(null, deleteRestaurant)
    } catch (err) {
      cb(err)
    }
  },
}
module.exports = adminService
