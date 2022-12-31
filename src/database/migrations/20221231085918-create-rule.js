'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Rule', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      parentId: DataTypes.INTEGER,
      korTitle: DataTypes.TEXT,
      engTitle: DataTypes.TEXT,
      korContent: DataTypes.TEXT,
      engContent: DataTypes.TEXT,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Rule');
  }
};
