const { Category } = require('../../models')

const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const categoryId = req.params.id
      const [categories, category] = await Promise.all([
        Category.findAll({ raw: true, paranoid: false }),
        categoryId
          ? Category.findByPk(categoryId, { raw: true, paranoid: false })
          : null,
      ])
      if (!categories) throw new Error('Categories are not exist!')

      res.render('admin/categories', { categories, category })
    } catch (err) {
      next(err)
    }
  },
  postCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('Category name is required!')

      const category = await Category.findOne({ where: { name } })
      if (category) throw new Error('Category is exist!')

      await Category.create({ name })

      req.flash('success_messages', 'Category was successfully created!')
      return res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  },
  putCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      const categoryId = req.params.id
      if (!name) throw new Error('Category name is required!')

      const category = await Category.findByPk(categoryId, { paranoid: false })
      if (!category) throw new Error("Category didn't exist!")
      await category.update({ name })

      req.flash('success_messages', 'Category was successfully updated!')
      return res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  },
  deleteCategory: async (req, res, next) => {
    try {
      const categoryId = req.params.id
      const { softDelete } = req.body

      const category = await Category.findByPk(categoryId, {
        paranoid: false,
      })
      if (!category) throw new Error("Category didn't exist!")

      softDelete
        ? await category.destroy()
        : await category.destroy({ force: true })

      req.flash('success_messages', 'Category was successfully deleted!')
      return res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  },
  restoreCategory: async (req, res, next) => {
    try {
      const categoryId = req.params.id

      const category = await Category.findByPk(categoryId, { paranoid: false })
      if (!category) throw new Error("Category didn't exist!")

      await category.restore()

      req.flash('success_messages', 'Category was successfully restored!')
      return res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  },
}

module.exports = categoryController
