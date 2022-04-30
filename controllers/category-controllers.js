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
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.findOne({ where: { name } })
      .then((category) => {
        if (category) throw new Error('Category is exist!')
        return Category.create({ name })
      })
      .then(() => {
        req.flash('success_messages', 'Category was successfully created!')
        res.redirect('/admin/categories')
      })
      .catch((err) => next(err))
  },
}

module.exports = categoryController
