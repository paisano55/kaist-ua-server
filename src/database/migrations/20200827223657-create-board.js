'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Board', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      korTitle: Sequelize.STRING,
      engTitle: Sequelize.STRING,
      korDescription: Sequelize.TEXT,
      engDescription: Sequelize.TEXT,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Board');
  },
};
