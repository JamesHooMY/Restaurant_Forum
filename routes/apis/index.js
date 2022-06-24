const express = require('express')
const router = express.Router()

const restController = require('../../controllers/apis/restaurant-controllers')
const userController = require('../../controllers/apis/user-controllers')
const passport = require('../../config/passport')
const admin = require('./modules/admin')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')
const upload = require('../../middleware/multer')

// user login
router.post('/signup', userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)

// user profile
router.put('/user/:id', authenticated, upload.single('image'), userController.putUser)
router.get('/user/:id', authenticated, userController.getUser)

// user browse restaurants
router.get('/restaurants', authenticated, restController.getRestaurants)

//user favorite restaurants
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.deleteFavorite)

// administrator
router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/', apiErrorHandler)

module.exports = router
