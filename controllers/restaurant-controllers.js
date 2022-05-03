const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restController = {
  getRestaurants: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 9
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const categoryId = Number(req.query.categoryId) || ''

      const [restaurants, categories] = await Promise.all([
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
      if (!restaurants) throw new Error('Restaurants is not exist!')
      if (!categories) throw new Error('Categories is not exist!')

      const data = restaurants.rows.map((restaurant) => ({
        ...restaurant,
        description: restaurant.description.substring(0, 50),
        // replace the description with limited 50 substring
      }))

      return res.render('restaurants', {
        restaurants: data,
        categories,
        categoryId,
        pagination: getPagination(limit, page, restaurants.count),
      })
    } catch (err) {
      next(err)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurantId = req.params.id

      const restaurant = await Restaurant.findByPk(restaurantId, {
        include: [Category, { model: Comment, include: User }],
        order: [[Comment, 'createdAt', 'DESC']],
      })
      if (!restaurant) throw new Error('Restaurant is not exist!')

      return res.render('restaurant', { restaurant: restaurant.toJSON() })
    } catch (err) {
      next(err)
    }
  },
}

module.exports = restController
