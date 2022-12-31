'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Intro', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      parentId: DataTypes.INTEGER,
      subId: DataTypes.INTEGER,
      korTitle: DataTypes.TEXT,
      engTitle: DataTypes.TEXT,
      korContent: DataTypes.TEXT,
      engContent: DataTypes.TEXT,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Intro');
  }
};
