const { Restaurant, Category } = require('../models')
const {
  localFileHandler,
  imgurFileHandler,
} = require('../helpers/file-helpers')
const imgur = require('imgur')

const adminController = {
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      .then((restaurants) => res.render('admin/restaurants', { restaurants }))
      .catch((err) => next(err))
  },
  createRestaurant: (req, res) => {
    return Category.findAll({ raw: true })
      .then((categories) =>
        res.render('admin/create-restaurant', { categories })
      )
      .catch((err) => next(err))
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } =
      req.body
    if (!name) throw new Error('Restaurant name is required!')
    const { file } = req // multer process image in to "req.file"
    return imgurFileHandler(file)
      .then((file) => {
        const filePath = file?.link || null
        const deleteHash = file?.deletehash || null
        return Restaurant.create({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || null,
          deleteHash: deleteHash || null,
          categoryId,
        })
      })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created!')
        res.redirect('/admin/restaurants')
      })
      .catch((err) => next(err))
  },
  getRestaurant: (req, res, next) => {
    const restaurantId = req.params.id
    return Restaurant.findByPk(restaurantId, { raw: true })
      .then((restaurant) => {
        if (!restaurant) throw new Error('Restaurant is not exist!')
        res.render('admin/restaurant', { restaurant })
      })
      .catch((err) => next(err))
  },
  editRestaurant: (req, res, next) => {
    const restaurantId = req.params.id
    Promise.all([
      Restaurant.findByPk(restaurantId, { raw: true }),
      Category.findAll({ raw: true }),
    ])
      .then(([restaurant, categories]) => {
        if (!restaurant) throw new Error('Restaurant is not exist!')
        res.render('admin/edit-restaurant', { restaurant, categories })
      })
      .catch((err) => next(err))
  },
  putRestaurant: (req, res, next) => {
    const restaurantId = req.params.id
    const { name, tel, address, openingHours, description, categoryId } =
      req.body
    if (!name) throw new Error('Restaurant name is required!')
    const { file } = req
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      imgurFileHandler(file),
    ])
      .then(async ([restaurant, file]) => {
        if (!restaurant) throw new Error('Restaurant is not exist!')
        const filePath = file?.link || null
        const deleteHash = file?.deletehash || null
        if (deleteHash) await imgur.deleteImage(restaurant.deleteHash)
        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || null,
          deleteHash: deleteHash || restaurant.deleteHash,
          categoryId,
        })
      })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully edited!')
        res.redirect('/admin/restaurants')
      })
      .catch((err) => next(err))
  },
  deleteRestaurant: (req, res, next) => {
    const restaurantId = req.params.id
    return Restaurant.findByPk(restaurantId)
      .then((restaurant) => {
        if (!restaurant) throw new Error('Restaurant is not exist!')
        return restaurant.destroy()
      })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully deleted!')
        res.redirect('/admin/restaurants')
      })
      .catch((err) => next(err))
  },
}

module.exports = adminController
