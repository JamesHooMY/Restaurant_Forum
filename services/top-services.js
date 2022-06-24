const { User, Restaurant, sequelize } = require('../models')
const helpers = require('../helpers/auth-helpers')

const topService = {
  getTopUsers: async (req, cb) => {
    try {
      const userId = helpers.getUser(req).id

      let users = await User.findAll({
        attributes: [
          'id',
          'name',
          'image',
          [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCounts'],
          [sequelize.literal(`EXISTS (SELECT follower_id FROM Followships WHERE Followships.following_id = User.id AND Followships.Follower_id  = ${userId})`), 'isFollowed'],
        ],
        order: [[sequelize.col('followerCounts'), 'DESC']],
        limit: 10,
      })

      users = users.map((user) => ({ ...user.toJSON() }))

      return cb(null, { users })
    } catch (err) {
      cb(err)
    }
  },
  getTopRestaurants: async (req, cb) => {
    try {
      const userId = helpers.getUser(req).id

      let restaurants = await Restaurant.findAll({
        attributes: [
          'id',
          'name',
          'image',
          'description',
          [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Favorites WHERE Favorites.restaurant_id = Restaurant.id)'), 'favoritedUserCounts'],
          [sequelize.literal(`EXISTS (SELECT user_id FROM Favorites WHERE Favorites.restaurant_id = Restaurant.id AND Favorites.user_id  = ${userId})`), 'isFavorited'],
        ],
        order: [[sequelize.col('favoritedUserCounts'), 'DESC']],
        limit: 10,
      })

      restaurants = restaurants.map((restaurant) => ({
        ...restaurant.toJSON(),
      }))

      return cb(null, { restaurants })
    } catch (err) {
      cb(err)
    }
  },
}

module.exports = topService
