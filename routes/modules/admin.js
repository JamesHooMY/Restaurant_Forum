const express = require('express')
const router = express.Router()

const upload = require('../../middleware/multer')
const adminController = require('../../controllers/admin-controllers')
const categoryController = require('../../controllers/category-controllers')

router.get('/category/:id', categoryController.getCategories)
router.post('/category', categoryController.postCategory)
router.put('/category/:id', categoryController.putCategory)
router.delete('/category/:id', categoryController.deleteCategory)
router.post('/category/:id', categoryController.restoreCategory)
router.get('/categories', categoryController.getCategories)
router.get('/restaurant/create', adminController.createRestaurant)
router.post(
  '/restaurant',
  upload.single('image'),
  adminController.postRestaurant
)
router.get('/restaurant/:id', adminController.getRestaurant)
router.get('/restaurant/:id/edit', adminController.editRestaurant)
router.put(
  '/restaurant/:id',
  upload.single('image'),
  adminController.putRestaurant
)
router.delete('/restaurant/:id', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.get('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
