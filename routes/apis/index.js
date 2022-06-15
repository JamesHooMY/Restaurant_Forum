const express = require('express')
const router = express.Router()

const restController = require('../../controllers/apis/restaurant-controllers')
const userController = require('../../controllers/apis/user-controllers')
const passport = require('../../config/passport')
const admin = require('./modules/admin')
const {
  authenticated,
  authenticatedAdmin,
} = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')

router.post(
  '/signin',
  passport.authenticate('local', { session: false }),
  userController.signIn
)

router.get('/restaurants', authenticated, restController.getRestaurants)

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/', apiErrorHandler)

module.exports = router
