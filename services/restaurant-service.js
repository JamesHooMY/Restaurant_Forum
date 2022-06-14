const { Restaurant, Category, Comment, User, Like } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restController = {
  getRestaurants: async (req, cb) => {
    try {
      const DEFAULT_LIMIT = 9
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const categoryId = Number(req.query.categoryId) || ''

      const [restaurants, categories] = await Promise.all([
        Restaurant.findAndCountAll({
          // raw, nest will effect the results of include with multiple models
          // raw: true,
          // nest: true,
          include: [
            Category,
            Comment,
            {
              model: User,
              as: 'FavoritedUsers',
            },
            {
              model: User,
              as: 'LikedUsers',
            },
          ],
          where: { ...(categoryId ? { categoryId } : {}) },
          limit,
          offset: getOffset(limit, page),
        }),
        Category.findAll({ raw: true }),
      ])
      if (!restaurants) throw new Error('Restaurants is not exist!')
      if (!categories) throw new Error('Categories is not exist!')
      // console.log(restaurants)

      const favoritedRestaurantIds =
        req.user?.FavoritedRestaurants.map(
          (favoritedRestaurant) => favoritedRestaurant.id
        ) || []
      const likedRestaurantIds =
        req.user?.LikedRestaurants.map(
          (likedRestaurant) => likedRestaurant.id
        ) || []

      const data = restaurants.rows.map((restaurant) => ({
        ...restaurant.toJSON(),
        description: restaurant.description.substring(0, 50),
        // replace the description with limited 50 substring

        isFavorited: favoritedRestaurantIds?.includes(restaurant.id) || [],
        isLiked: likedRestaurantIds?.includes(restaurant.id) || [],

        // favoritedUserCounts: restaurant.FavoritedUsers.length,
        FavoritedUsers: restaurant.FavoritedUsers.length,
        LikedUsers: restaurant.LikedUsers.length,

        Comments: restaurant.Comments.length,
      }))

      // console.log(data)
      return cb(null, {
        restaurants: data,
        categories,
        categoryId,
        pagination: getPagination(limit, page, data.count),
        // if user "restaurants.count", after soft_delete category will effect the pages number of pagination
      })
    } catch (err) {
      cb(err)
    }
  },
}

module.exports = restController
