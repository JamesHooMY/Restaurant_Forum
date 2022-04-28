const { Restaurant } = require('../models')

const adminController = {
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({ raw: true })
      .then((restaurants) => res.render('admin/restaurants', { restaurants }))
      .catch((err) => next(err))
  },
  createRestaurant: (req, res) => {
    res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    return Restaurant.create({
      name,
      tel,
      address,
      openingHours,
      description,
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
  editRestaurant: (req, res) => {
    const restaurantId = req.params.id
    return Restaurant.findByPk(restaurantId, { raw: true })
      .then((restaurant) => {
        if (!restaurant) throw new Error('Restaurant is not exist!')
        res.render('admin/edit-restaurant', { restaurant })
      })
      .catch((err) => next(err))
  },
  putRestaurant: (req, res) => {
    const restaurantId = req.params.id
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    return Restaurant.findByPk(restaurantId)
      .then((restaurant) => {
        if (!restaurant) throw new Error('Restaurant is not exist!')
        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description,
        })
      })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully edited!')
        res.redirect('/admin/restaurants')
      })
      .catch((err) => next(err))
  },
  deleteRestaurant: (req, res) => {
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
