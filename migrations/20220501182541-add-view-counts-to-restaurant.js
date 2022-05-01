'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Restaurants', 'view_counts', {
      type: Sequelize.INTEGER,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Restaurants', 'view_counts')
  },
}
