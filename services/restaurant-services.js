const { Restaurant, Category, Comment, User, Like, sequelize } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const helpers = require('../helpers/auth-helpers')

const restService = {
  getRestaurants: async (req, cb) => {
    try {
      const userId = req.user.id
      const DEFAULT_LIMIT = 9
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const categoryId = Number(req.query.categoryId) || ''

      const [restaurants, categories] = await Promise.all([
        Restaurant.findAndCountAll({
          include: [{ model: Category, attributes: ['id', 'name'] }],
          attributes: [
            'id',
            'name',
            'image',
            'viewCounts',
            [sequelize.fn('LEFT', sequelize.col('description'), 49), 'description'],
            [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Comments WHERE Comments.restaurant_id = Restaurant.id)'), 'commentCounts'],
            [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Favorites WHERE Favorites.restaurant_id = Restaurant.id)'), 'favoritedUserCounts'],
            [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Likes WHERE Likes.restaurant_id = Restaurant.id)'), 'LikedUserCounts'],
            [sequelize.literal(`EXISTS (SELECT user_id FROM Favorites WHERE Favorites.restaurant_id = Restaurant.id AND Favorites.user_id  = ${userId})`), 'isFavorited'],
            [sequelize.literal(`EXISTS (SELECT user_id FROM Likes WHERE Likes.restaurant_id = Restaurant.id AND Likes.user_id  = ${userId})`), 'isLiked'],
          ],
          where: { ...(categoryId ? { categoryId } : {}) },
          limit,
          offset: getOffset(limit, page),
        }),
        Category.findAll({ attributes: ['id', 'name'], raw: true }),
      ])
      if (!restaurants) throw new Error('Restaurants is not exist!')
      if (!categories) throw new Error('Categories is not exist!')

      const data = restaurants.rows.map((restaurant) => ({
        ...restaurant.toJSON(),
      }))

      return cb(null, {
        restaurants: data,
        categories,
        categoryId,
        pagination: getPagination(limit, page, data.count),
      })
    } catch (err) {
      cb(err)
    }
  },
  getRestaurant: async (req, cb) => {
    try {
      const restaurantId = req.params.id

      let restaurant = await Restaurant.findByPk(restaurantId, {
        include: [Category, { model: Comment, include: User }, { model: User, as: 'FavoritedUsers' }, { model: User, as: 'LikedUsers' }],
        order: [[Comment, 'createdAt', 'DESC']],
      })
      if (!restaurant) throw new Error('Restaurant is not exist!')

      await restaurant.increment({ viewCounts: 1 })
      restaurant = restaurant.toJSON()
      restaurant.viewCounts += 1

      const favoritedRestaurantIds = req.user.FavoritedRestaurants?.map((favoritedRestaurant) => favoritedRestaurant.id)
      const likedRestaurantIds = req.user.LikedRestaurants?.map((likedRestaurant) => likedRestaurant.id)

      restaurant.isFavorited = favoritedRestaurantIds.includes(restaurant.id)
      restaurant.isLiked = likedRestaurantIds.includes(restaurant.id)

      return cb(null, { restaurant })
    } catch (err) {
      cb(err)
    }
  },
  getNews: async (req, cb) => {
    try {
      const [restaurants, comments] = await Promise.all([
        Restaurant.findAll({
          limit: 10,
          include: [Category],
          order: [['createdAt', 'DESC']],
          raw: true,
          nest: true,
        }),
        Comment.findAll({
          limit: 10,
          include: [{ model: Restaurant, include: Category }, User],
          order: [['createdAt', 'DESC']],
          raw: true,
          nest: true,
        }),
      ])

      return cb(null, { restaurants, comments })
    } catch (err) {
      cb(err)
    }
  },
}

module.exports = restService
