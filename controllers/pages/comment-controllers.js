const commentServices = require('../../services/comment-services')

const commentController = {
  postComment: async (req, res, next) => {
    commentServices.postComment(req, (err, data) => (err ? next(err) : res.redirect('back')))
  },
  deleteComment: async (req, res, next) => {
    commentServices.deleteComment(req, (err, data) => (err ? next(err) : res.redirect('back')))
  },
}

module.exports = commentController
