const express = require('express')
const router = express.Router()

const restController = require('../../controllers/apis/restaurant-controllers')
const admin = require('./modules/admin')

router.get('/restaurants', restController.getRestaurants)
router.use('/admin', admin)

module.exports = router
