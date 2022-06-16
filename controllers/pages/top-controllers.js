const { User, Restaurant, sequelize } = require('../../models')
const helpers = require('../../helpers/auth-helpers')

const topController = {
  getTopUsers: async (req, res, next) => {
    try {
      const userId = req.user.id

      let users = await User.findAll({
        attributes: [
          'id',
          'name',
          'image',
          [
            sequelize.literal(
              '(SELECT COUNT(DISTINCT id) FROM Followships WHERE Followships.following_id = User.id)'
            ),
            'followerCounts',
          ],
          [
            sequelize.literal(
              `EXISTS (SELECT follower_id FROM Followships WHERE Followships.following_id = User.id AND Followships.Follower_id  = ${userId})`
            ),
            'isFollowed',
          ],
        ],
        order: [[sequelize.col('followerCounts'), 'DESC']],
        limit: 10,
      })

      users = users.map((user) => ({ ...user.toJSON() }))

      console.log(users)
      // let users = await User.findAll({
      //   include: [{ model: User, as: 'Followers', attributes: ['id'] }],
      // })

      // users = users
      //   .map((user) => ({
      //     ...user.toJSON(),
      //     followerCount: user.Followers.length,
      //     isFollowed: req.user.Followings.some((f) => f.id === user.id),
      //   }))
      //   .sort((a, b) => b.followerCount - a.followerCount)

      res.render('top-users', { users })
    } catch (err) {
      next(err)
    }
  },
  getTopRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        include: [{ model: User, as: 'FavoritedUsers' }],
      })

      const userId = helpers.getUser(req).id
      const limit = 10

      const result = restaurants
        .map((restaurant) => ({
          ...restaurant.toJSON(),
          description: restaurant.description.substring(0, 50),
          favoritedCount: restaurant.FavoritedUsers.length,
          isFavorited: restaurant.FavoritedUsers.some(
            (user) => Number(user.id) === Number(userId)
          ),
        }))
        .sort((a, b) => b.favoritedCount - a.favoritedCount)
        .slice(0, limit)

      res.render('top-restaurants', { restaurants: result })
    } catch (err) {
      next(err)
    }
  },
}

module.exports = topController
