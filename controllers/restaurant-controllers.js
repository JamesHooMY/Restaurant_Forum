const {
  Restaurant,
  Category,
  Comment,
  User,
  Favorite,
  sequelize,
} = require('../models')
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
      const data = restaurants.rows.map((restaurant) => ({
        ...restaurant.toJSON(),
        description: restaurant.description.substring(0, 50),
        // replace the description with limited 50 substring
        isFavorited: req.user.FavoritedRestaurants?.map(
          (favoritedRestaurant) => favoritedRestaurant.id
        ).includes(restaurant.id),
        // favoritedUserCounts: restaurant.FavoritedUsers.length,
        FavoritedUsers: restaurant.FavoritedUsers.length,
        Comments: restaurant.Comments.length,
      }))

      console.log(data)
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

      let restaurant = await Restaurant.findByPk(restaurantId, {
        include: [
          Category,
          { model: Comment, include: User },
          {
            model: User,
            as: 'FavoritedUsers',
          },
        ],
        order: [[Comment, 'createdAt', 'DESC']],
      })
      if (!restaurant) throw new Error('Restaurant is not exist!')

      await restaurant.increment({ viewCounts: 1 }) // update database viewCounts

      restaurant = restaurant.toJSON()
      console.log(restaurant)

      restaurant.viewCounts += 1 // update data viewCounts for render
      restaurant.isFavorited = req.user.FavoritedRestaurants?.map(
        (favoritedRestaurant) => favoritedRestaurant.id
      ).includes(restaurant.id)

      return res.render('restaurant', { restaurant })
    } catch (err) {
      next(err)
    }
  },
  getNews: async (req, res, next) => {
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
        include: [Restaurant, User],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true,
      }),
    ])
    console.log(comments)
    return res.render('news', { restaurants, comments })
  },
}

module.exports = restController
