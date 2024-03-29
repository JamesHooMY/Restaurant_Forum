const { Restaurant, Category } = require('../../models')
const { localFileHandler, imgurFileHandler } = require('../../helpers/file-helpers')
const adminServices = require('../../services/admin-services')
const imgur = require('imgur')

const adminController = {
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(req, (err, data) => (err ? next(err) : res.render('admin/restaurants', data)))
  },
  createRestaurant: async (req, res, next) => {
    try {
      const categories = await Category.findAll({ raw: true })

      return res.render('admin/create-restaurant', { categories })
    } catch (err) {
      next(err)
    }
  },
  postRestaurant: (req, res, next) => {
    if (err) return next(err)
    req.flash('success_messages', 'restaurant was successfully created!')
    return res.redirect('/admin/restaurants', data)
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

      const [restaurant, categories] = await Promise.all([Restaurant.findByPk(restaurantId, { raw: true }), Category.findAll({ raw: true })])
      if (!restaurant) throw new Error('Restaurant is not exist!')

      return res.render('admin/edit-restaurant', { restaurant, categories })
    } catch (err) {
      next(err)
    }
  },
  putRestaurant: async (req, res, next) => {
    try {
      adminServices.putRestaurant(req, (err, data) => {
        if (err) return next(err)
        req.flash('success_messages', 'restaurant was successfully edited!')
        return res.redirect('/admin/restaurants')
      })
    } catch (err) {
      next(err)
    }
  },
  deleteRestaurant: async (req, res, next) => {
    adminServices.deleteRestaurant(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', 'restaurant was successfully deleted!')
      return res.redirect('/admin/restaurants', data)
    })
  },
}

module.exports = adminController
