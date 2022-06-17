const {
  Restaurant,
  Category,
  Comment,
  User,
  Like,
  sequelize,
} = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const helpers = require('../helpers/auth-helpers')

const restService = {
  getRestaurants: async (req, cb) => {
    try {
      const userId = req.user.id
      const DEFAULT_LIMIT = 9
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const categoryId = Number(req.query.categoryId) || ''

      const [restaurants, categories] = await Promise.all([
        Restaurant.findAndCountAll({
          include: [
            { model: Category, attributes: ['id', 'name'] },
            // { model: Comment, attributes: ['id'] },
            // { model: User, as: 'FavoritedUsers' },
            // { model: User, as: 'LikedUsers' },
          ],
          attributes: [
            'id',
            'name',
            'image',
            'viewCounts',
            [
              sequelize.fn('LEFT', sequelize.col('description'), 49),
              'description',
            ],
            [
              sequelize.literal(
                '(SELECT COUNT(DISTINCT id) FROM Comments WHERE Comments.restaurant_id = Restaurant.id)'
              ),
              'commentCounts',
            ],
            [
              sequelize.literal(
                '(SELECT COUNT(DISTINCT id) FROM Favorites WHERE Favorites.restaurant_id = Restaurant.id)'
              ),
              'favoritedUserCounts',
            ],
            [
              sequelize.literal(
                '(SELECT COUNT(DISTINCT id) FROM Likes WHERE Likes.restaurant_id = Restaurant.id)'
              ),
              'LikedUserCounts',
            ],
            [
              sequelize.literal(
                `EXISTS (SELECT user_id FROM Favorites WHERE Favorites.restaurant_id = Restaurant.id AND Favorites.user_id  = ${userId})`
              ),
              'isFavorited',
            ],
            [
              sequelize.literal(
                `EXISTS (SELECT user_id FROM Likes WHERE Likes.restaurant_id = Restaurant.id AND Likes.user_id  = ${userId})`
              ),
              'isLiked',
            ],
          ],
          where: { ...(categoryId ? { categoryId } : {}) }, // click the category tab will get this id for selecting the related restaurants
          limit,
          offset: getOffset(limit, page),
        }),
        Category.findAll({ attributes: ['id', 'name'], raw: true }),
      ])
      if (!restaurants) throw new Error('Restaurants is not exist!')
      if (!categories) throw new Error('Categories is not exist!')
      // console.log(restaurants)

      // const favoritedRestaurantIds =
      //   req.user?.FavoritedRestaurants.map(
      //     (favoritedRestaurant) => favoritedRestaurant.id
      //   ) || []
      // const likedRestaurantIds =
      //   req.user?.LikedRestaurants.map(
      //     (likedRestaurant) => likedRestaurant.id
      //   ) || []

      const data = restaurants.rows.map((restaurant) => ({
        ...restaurant.toJSON(),
        // description: restaurant.description.substring(0, 50),
        // replace the description with limited 50 substring

        // isFavorited: favoritedRestaurantIds?.includes(restaurant.id) || [],
        // isLiked: likedRestaurantIds?.includes(restaurant.id) || [],

        // Comments: restaurant.Comments.length,
      }))

      // console.log(data)
      return cb(null, {
        restaurants: data,
        categories,
        categoryId,
        pagination: getPagination(limit, page, data.count),
        // if user "restaurants.count", after soft_delete category will effect the pages number of pagination
      })
    } catch (err) {
      cb(err)
    }
  },
}

module.exports = restService
