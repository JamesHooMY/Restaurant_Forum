'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Categories', 'deleted_at', {
      type: Sequelize.DATE,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Categories', 'deleted_at')
  },
}
