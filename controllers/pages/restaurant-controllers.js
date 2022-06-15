const { Restaurant, Category, Comment, User, Like } = require('../../models')
const { getOffset, getPagination } = require('../../helpers/pagination-helper')
const restaurantServices = require('../../services/restaurant-services')

const restController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, data) =>
      err ? next(err) : res.render('restaurants', data)
    )
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
          {
            model: User,
            as: 'LikedUsers',
          },
        ],
        order: [[Comment, 'createdAt', 'DESC']],
      })
      if (!restaurant) throw new Error('Restaurant is not exist!')

      await restaurant.increment({ viewCounts: 1 }) // update database viewCounts

      restaurant = restaurant.toJSON()
      // console.log(restaurant)
      restaurant.viewCounts += 1 // update data viewCounts for render

      const favoritedRestaurantIds = req.user.FavoritedRestaurants?.map(
        (favoritedRestaurant) => favoritedRestaurant.id
      )
      const likedRestaurantIds = req.user.LikedRestaurants?.map(
        (likedRestaurant) => likedRestaurant.id
      )

      restaurant.isFavorited = favoritedRestaurantIds.includes(restaurant.id)
      restaurant.isLiked = likedRestaurantIds.includes(restaurant.id)

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
        include: [{ model: Restaurant, include: Category }, User],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true,
      }),
    ])
    // console.log(comments)
    return res.render('news', { restaurants, comments })
  },
}

module.exports = restController
