const { Restaurant, Category } = require('../../models')
const {
  localFileHandler,
  imgurFileHandler,
} = require('../../helpers/file-helpers')
const adminServices = require('../../services/admin-services')
const imgur = require('imgur')

const adminController = {
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(req, (err, data) =>
      err ? next(err) : res.render('admin/restaurants', data)
    )
  },
  createRestaurant: async (req, res) => {
    try {
      const categories = await Category.findAll({ raw: true })

      return res.render('admin/create-restaurant', { categories })
    } catch (err) {
      next(err)
    }
  },
  postRestaurant: async (req, res, next) => {
    try {
      const { name, tel, address, openingHours, description, categoryId } =
        req.body
      if (!name) throw new Error('Restaurant name is required!')

      const file = await imgurFileHandler(req.file) // multer process image in to "req.file"
      await Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: file?.link || null,
        deleteHash: file?.deletehash || null,
        categoryId,
      })

      req.flash('success_messages', 'restaurant was successfully created!')
      return res.redirect('/admin/restaurants')
    } catch (err) {
      next(err)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurantId = req.params.id
      const restaurant = await Restaurant.findByPk(restaurantId, { raw: true })
      if (!restaurant) throw new Error('Restaurant is not exist!')

      return res.render('admin/restaurant', { restaurant })
    } catch (err) {
      next(err)
    }
  },
  editRestaurant: async (req, res, next) => {
    try {
      const restaurantId = req.params.id

      const [restaurant, categories] = await Promise.all([
        Restaurant.findByPk(restaurantId, { raw: true }),
        Category.findAll({ raw: true }),
      ])
      if (!restaurant) throw new Error('Restaurant is not exist!')

      return res.render('admin/edit-restaurant', { restaurant, categories })
    } catch (err) {
      next(err)
    }
  },
  putRestaurant: async (req, res, next) => {
    try {
      const restaurantId = req.params.id

      const { name, tel, address, openingHours, description, categoryId } =
        req.body
      if (!name) throw new Error('Restaurant name is required!')

      const [restaurant, file] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        imgurFileHandler(req.file),
      ])
      if (!restaurant) throw new Error('Restaurant is not exist!')

      if (file?.deletehash && restaurant.deleteHash)
        await imgur.deleteImage(restaurant.deleteHash)
      // file?.deletehash && restaurant.deleteHash
      //   ? await imgur.deleteImage(restaurant.deleteHash)
      //   : null

      await restaurant.update({
        name,
        tel,
        address,
        openingHours,
        description,
        image: file?.link || restaurant.image,
        deleteHash: file?.deletehash || restaurant.deleteHash,
        categoryId,
      })

      req.flash('success_messages', 'restaurant was successfully edited!')
      return res.redirect('/admin/restaurants')
    } catch (err) {
      next(err)
    }
  },
  deleteRestaurant: async (req, res, next) => {
    adminServices.deleteRestaurant(req, (err, data) =>
      err ? next(err) : res.redirect('/admin/restaurants', data)
    )
  },
}

module.exports = adminController
