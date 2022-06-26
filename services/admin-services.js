const { Restaurant, Category } = require('../models')
const { localFileHandler, imgurFileHandler } = require('../helpers/file-helpers')
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
  getRestaurant: async (req, cb) => {
    try {
      const restaurantId = req.params.id
      const restaurant = await Restaurant.findByPk(restaurantId, { raw: true })
      if (!restaurant) throw new Error('Restaurant is not exist!')

      return cb(null, { restaurant })
    } catch (err) {
      cb(err)
    }
  },
  postRestaurant: async (req, cb) => {
    try {
      const { name, tel, address, openingHours, description, categoryId } = req.body
      if (!name) throw new Error('Restaurant name is required!')

      const file = await imgurFileHandler(req.file) // multer process image in to "req.file"
      const newRestaurant = await Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: file?.link || null,
        deleteHash: file?.deletehash || null,
        categoryId,
      })

      return cb(null, newRestaurant)
    } catch (err) {
      cb(err)
    }
  },
  putRestaurant: async (req, cb) => {
    try {
      const restaurantId = req.params.id

      const { name, tel, address, openingHours, description, categoryId } = req.body
      if (!name) throw new Error('Restaurant name is required!')

      const [restaurant, file] = await Promise.all([Restaurant.findByPk(restaurantId), imgurFileHandler(req.file)])
      if (!restaurant) throw new Error('Restaurant is not exist!')

      if (file?.deletehash && restaurant.deleteHash) await imgur.deleteImage(restaurant.deleteHash)

      const editedRestaurant = await restaurant.update({
        name,
        tel,
        address,
        openingHours,
        description,
        image: file?.link || restaurant.image,
        deleteHash: file?.deletehash || restaurant.deleteHash,
        categoryId,
      })

      return cb(null, editedRestaurant)
    } catch (err) {
      cb(err)
    }
  },
  deleteRestaurant: async (req, cb) => {
    try {
      const restaurantId = req.params.id

      const restaurant = await Restaurant.findByPk(restaurantId)
      if (!restaurant) throw new Error('Restaurant is not exist!')

      if (restaurant.toJSON().deleteHash) await imgur.deleteImage(restaurant.toJSON().deleteHash)

      const deletedRestaurant = await restaurant.destroy()

      return cb(null, deletedRestaurant)
    } catch (err) {
      cb(err)
    }
  },
}
module.exports = adminService
