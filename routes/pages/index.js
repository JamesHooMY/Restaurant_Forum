const express = require('express')
const router = express.Router()

const userController = require('../../controllers/pages/user-controllers')
const restController = require('../../controllers/pages/restaurant-controllers')
const commentController = require('../../controllers/pages/comment-controllers')
const passport = require('../../config/passport')
const admin = require('./modules/admin')
const { generalErrorHandler } = require('../../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../../middleware/auth')
const upload = require('../../middleware/multer')

// user login
router.get('/logout', userController.logout)
router.get('/signin', userController.signInPage)
router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true,
  }),
  userController.signIn
)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// user comments
router.post('/comment', authenticated, commentController.postComment)
router.delete(
  '/comment/:id',
  authenticatedAdmin,
  commentController.deleteComment
)

// user browse restaurants
router.get('/restaurant/:id', authenticated, restController.getRestaurant)
router.get('/restaurants/news', authenticated, restController.getNews)
router.get('/restaurants', authenticated, restController.getRestaurants)

//user favorite restaurants
router.post(
  '/favorite/:restaurantId',
  authenticated,
  userController.addFavorite
)
router.delete(
  '/favorite/:restaurantId',
  authenticated,
  userController.deleteFavorite
)

//user like restaurants
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.deleteLike)

// user profile
router.get('/user/:id/edit', authenticated, userController.editUser)
router.put(
  '/user/:id',
  authenticated,
  upload.single('image'),
  userController.putUser
)
router.get('/user/:id', authenticated, userController.getUser)

// administrator
router.use('/admin', authenticatedAdmin, admin)
router.get('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
