const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    const categoryId = req.params.id
    return Promise.all([
      Category.findAll({ raw: true, paranoid: false }),
      categoryId
        ? Category.findByPk(categoryId, { raw: true, paranoid: false })
        : null,
    ])
      .then(([categories, category]) => {
        if (!categories) throw new Error('Categories are not exist!')
        if (!category) throw new Error('Category is not exist!')
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
    return Category.findByPk(categoryId, { paranoid: false })
      .then((category) => {
        if (!category) throw new Error("Category didn't exist!")
        return category.update({ name })
      })
      .then(() => {
        req.flash('success_messages', 'Category was successfully updated!')
        res.redirect('/admin/categories')
      })
      .catch((err) => next(err))
  },
  deleteCategory: (req, res, next) => {
    const categoryId = req.params.id
    const { softDelete } = req.body
    return Category.findByPk(categoryId, { paranoid: false })
      .then((category) => {
        if (!category) throw new Error("Category didn't exist!")
        return softDelete
          ? category.destroy()
          : category.destroy({ force: true })
      })
      .then(() => {
        req.flash('success_messages', 'Category was successfully deleted!')
        res.redirect('/admin/categories')
      })
      .catch((err) => next(err))
  },
  restoreCategory: (req, res, next) => {
    const categoryId = req.params.id
    return Category.findByPk(categoryId, { paranoid: false })
      .then((category) => {
        if (!category) throw new Error("Category didn't exist!")
        return category.restore()
      })
      .then(() => {
        req.flash('success_messages', 'Category was successfully restored!')
        res.redirect('/admin/categories')
      })
      .catch((err) => next(err))
  },
}

module.exports = categoryController
