'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Restaurants', 'view_counts', {
      type: Sequelize.INTEGER,
      defaultValue: 0, // define for increment() auto calculation, if null cannot be calculated from initial
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Restaurants', 'view_counts')
  },
}
