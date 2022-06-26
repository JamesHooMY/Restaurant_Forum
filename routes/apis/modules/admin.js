const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/apis/admin-controllers')
const userController = require('../../../controllers/apis/user-controllers')
const upload = require('../../../middleware/multer')

// admin control users
router.get('/users', userController.getUsers)
router.patch('/user/:id', userController.patchUser)

// admin control restaurants
router.get('/restaurant/:id', adminController.getRestaurant)
router.put('/restaurant/:id', upload.single('image'), adminController.putRestaurant)
router.delete('/restaurant/:id', adminController.deleteRestaurant)
router.post('/restaurant', upload.single('image'), adminController.postRestaurant)
router.get('/restaurants', adminController.getRestaurants)

module.exports = router
