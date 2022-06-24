const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/apis/admin-controllers')
const userController = require('../../../controllers/apis/user-controllers')
const upload = require('../../../middleware/multer')

// admin control users
router.get('/users', userController.getUsers)

// admin control restaurants
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurant', upload.single('image'), adminController.postRestaurant)

module.exports = router
