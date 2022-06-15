const {
  User,
  Comment,
  Restaurant,
  Favorite,
  Like,
  Followship,
  sequelize,
} = require('../../models')

const topController = {
  getTopUsers: async (req, res, next) => {
    try {
      let users = await User.findAll({
        include: [{ model: User, as: 'Followers' }],
      })

      users = users
        .map((user) => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          isFollowed: req.user.Followings.some((f) => f.id === user.id),
        }))
        .sort((a, b) => b.followerCount - a.followerCount)

      res.render('top-users', { users: users })
    } catch (err) {
      next(err)
    }
  },
}

module.exports = topController
