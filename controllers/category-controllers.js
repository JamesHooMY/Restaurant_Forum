const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    const categoryId = req.params.id
    return Promise.all([
      Category.findAll({ raw: true }),
      categoryId ? Category.findByPk(categoryId, { raw: true }) : null,
    ])
      .then(([categories, category]) => {
        res.render('admin/categories', { categories, category })
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
  putCategory: (req, res, next) => {
    const { name } = req.body
    const categoryId = req.params.id
    if (!name) throw new Error('Category name is required!')
    return Category.findByPk(categoryId)
      .then((category) => {
        return category.update({ name })
      })
      .then(() => {
        req.flash('success_messages', 'Category was successfully updated!')
        res.redirect('/admin/categories')
      })
      .catch((err) => next(err))
  },
}

module.exports = categoryController
