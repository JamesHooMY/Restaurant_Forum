const express = require('express')
const router = express.Router()

const restController = require('../../controllers/apis/restaurant-controllers')
const userController = require('../../controllers/apis/user-controllers')
const topController = require('../../controllers/apis/top-controllers')
const commentController = require('../../controllers/apis/comment-controllers')
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

// user comments
router.post('/comment', authenticated, commentController.postComment)
router.delete('/comment/:id', authenticated, authenticatedAdmin, commentController.deleteComment)

// user browse restaurants
router.get('/restaurant/:id', authenticated, restController.getRestaurant)
router.get('/restaurants/news', authenticated, restController.getNews)
router.get('/restaurants', authenticated, restController.getRestaurants)

//user favorite restaurants
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.deleteFavorite)

//user like restaurants
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.deleteLike)

//user following
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

// top list
router.get('/top/users', authenticated, topController.getTopUsers)
router.get('/top/restaurants', authenticated, topController.getTopRestaurants)

// administrator
router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/', apiErrorHandler)

module.exports = router
