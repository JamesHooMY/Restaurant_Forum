const { Comment, User, Restaurant } = require('../models')

const commentService = {
  postComment: async (req, cb) => {
    try {
      const { text, restaurantId } = req.body
      const userId = req.user.id
      if (!text) throw new Error('Comment text is required!')

      const [user, restaurant] = await Promise.all([User.findByPk(userId), Restaurant.findByPk(restaurantId)])
      if (!user) throw new Error('User did not exist!')
      if (!restaurant) throw new Error('Restaurant did not exist!')

      const comment = await Comment.create({ text, userId, restaurantId })

      return cb(null, { comment })
    } catch (err) {
      cb(err)
    }
  },
  deleteComment: async (req, cb) => {
    try {
      const commentId = req.params.id

      const comment = await Comment.findByPk(commentId)
      if (!comment) throw new Error('Comment did not exits!')

      await comment.destroy()

      return cb(null, { comment })
    } catch (err) {
      cb(err)
    }
  },
}

module.exports = commentService
