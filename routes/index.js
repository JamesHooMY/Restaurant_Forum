const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller') 
const restController = require('../controllers/restaurant-controllers')
const admin = require('./modules/admin')

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp) 
router.get('/restaurants', restController.getRestaurants)
router.get('/', (req, res) => res.redirect('/restaurants'))
router.use('/admin', admin)

module.exports = router
