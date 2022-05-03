const { Restaurant, Category } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restController = {
  getRestaurants: async (req, res, next) => {
    const DEFAULT_LIMIT = 9
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const categoryId = Number(req.query.categoryId) || ''
    return Promise.all([
      Restaurant.findAndCountAll({
        raw: true,
        nest: true,
        include: [Category],
        where: { ...(categoryId ? { categoryId } : {}) },
        limit,
        offset: getOffset(limit, page),
      }),
      Category.findAll({ raw: true }),
    ])
      .then(([restaurants, categories]) => {
        if (!restaurants) throw new Error('Restaurants is not exist!')
        if (!categories) throw new Error('Categories is not exist!')
        const data = restaurants.rows.map((restaurant) => ({
          ...restaurant,
          description: restaurant.description.substring(0, 50),
          // replace the description with limited 50 substring
        }))
        res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count),
        })
      })
      .catch((err) => next(err))
  },
  getRestaurant: (req, res, next) => {
    const restaurantId = req.params.id
    return Restaurant.findByPk(restaurantId, {
      include: [Category],
    })
      .then((restaurant) => {
        if (!restaurant) throw new Error('Restaurant is not exist!')
        restaurant.viewCounts += 1
        return restaurant.update({ viewCounts: restaurant.viewCounts })
      })
      .then((restaurant) =>
        res.render('restaurant', { restaurant: restaurant.toJSON() })
      )
      .catch((err) => next(err))
  },
}

module.exports = restController
