const { Comment, User, Restaurant } = require('../../models')

const commentController = {
  postComment: async (req, res, next) => {
    try {
      const { text, restaurantId } = req.body
      const userId = req.user.id
      if (!text) throw new Error('Comment text is required!')

      const [user, restaurant] = await Promise.all([
        User.findByPk(userId),
        Restaurant.findByPk(restaurantId),
      ])
      if (!user) throw new Error('User did not exist!')
      if (!restaurant) throw new Error('Restaurant did not exist!')

      await Comment.create({ text, userId, restaurantId })

      req.flash('success_messages', 'Comment successfully submitted!')
      // return res.redirect(`/restaurant/${restaurantId}`)
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  deleteComment: async (req, res, next) => {
    try {
      const commentId = req.params.id

      const comment = await Comment.findByPk(commentId)
      if (!comment) throw new Error('Comment did not exits!')

      await comment.destroy()
      // const deletedComment = await comment.destroy()

      req.flash('success_messages', 'Comment was deleted sucessfully!')
      // return res.redirect(`/restaurant/${deletedComment.restaurantId}`)
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
}

module.exports = commentController
