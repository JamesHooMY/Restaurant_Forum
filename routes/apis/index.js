const express = require('express')
const router = express.Router()

const restController = require('../../controllers/apis/restaurant-controllers')
const admin = require('./modules/admin')
const { apiErrorHandler } = require('../../middleware/error-handler')

router.get('/restaurants', restController.getRestaurants)
router.use('/admin', admin)
router.use('/', apiErrorHandler)

module.exports = router
