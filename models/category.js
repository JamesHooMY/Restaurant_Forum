'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Category.hasMany(models.Restaurant, {
        foreignKey: 'categoryId',
        onDelete: 'CASCADE', // hard deleted
        hooks: true, // hard deleted
      })
    }
  }
  Category.init(
    {
      name: DataTypes.STRING,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'Categories',
      underscored: true,
      paranoid: true, // soft-delete migration:generate deleted-at
    }
  )
  return Category
}
