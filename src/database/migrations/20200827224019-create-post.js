'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Post', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      author: Sequelize.TEXT,
      korTitle: Sequelize.TEXT,
      engTitle: Sequelize.TEXT,
      korContent: Sequelize.TEXT,
      engContent: Sequelize.TEXT,
      views: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      isActive: Sequelize.BOOLEAN,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Post');
  },
};
