const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controllers')

router.get('/restaurant/create', adminController.createRestaurant)
router.post('/restaurant', adminController.postRestaurant)
router.get('/restaurant/:id', adminController.getRestaurant)
router.get('/restaurant/:id/edit', adminController.editRestaurant)
router.put('/restaurant/:id', adminController.putRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.get('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
