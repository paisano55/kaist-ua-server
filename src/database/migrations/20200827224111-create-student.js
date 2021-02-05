'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Student', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      studentNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      kaistUid: Sequelize.STRING,
      korName: Sequelize.STRING,
      engName: Sequelize.STRING,
      affiliation: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Student');
  },
};
