'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const [users, restaurants] = await Promise.all([
      queryInterface.sequelize.query('SELECT id FROM Users;', {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }),
      queryInterface.sequelize.query('SELECT id FROM Restaurants;', {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }),
    ])
    await queryInterface.bulkInsert(
      'Favorites',
      Array.from({ length: 50 }, () => ({
        user_id: users[Math.floor(Math.random() * users.length)].id,
        restaurant_id:
          restaurants[Math.floor(Math.random() * restaurants.length)].id,
        created_at: new Date(),
        updated_at: new Date(),
      }))
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Favorites', null, {})
  },
}
