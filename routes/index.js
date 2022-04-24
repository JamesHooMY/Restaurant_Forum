const express = require('express')
const router = express.Router()

const restController = require('../controllers/restaurant-controllers')
const admin = require('./modules/admin')

router.get('/restaurants', restController.getRestaurants)
router.get('/', (req, res) => res.redirect('/restaurants'))
router.use('/admin', admin)

module.exports = router
