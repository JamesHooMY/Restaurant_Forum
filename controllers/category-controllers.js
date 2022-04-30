const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    return Category.findAll({ raw: true })
      .then((categories) => {
        if (!categories) throw new Error('Categories are not exist!')
        res.render('admin/categories', { categories })
      })
      .catch((err) => next(err))
  },
}

module.exports = categoryController
