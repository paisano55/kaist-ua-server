'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('Intro', 'createdAt', {
        type: Sequelize.DATE,
      }),
      queryInterface.addColumn('Intro', 'updatedAt', {
        type: Sequelize.DATE,
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
