const { Restaurant, Category } = require('../models')
const {
  localFileHandler,
  imgurFileHandler,
} = require('../helpers/file-helpers')
const imgur = require('imgur')

const adminService = {
  getRestaurants: async (req, cb) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category],
      })
      return cb(null, { restaurants })
    } catch (err) {
      cb(err)
    }
  },
}
module.exports = adminService
