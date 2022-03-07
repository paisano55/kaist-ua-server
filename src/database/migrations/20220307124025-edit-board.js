'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      queryInterface.addColumn("Board", "redirection", {
        type: Sequelize.TEXT
      }),
      queryInterface.addColumn("Board", "viewHome", {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      queryInterface.removeColumn('Board', 'redirection'),
      queryInterface.removeColumn('Board', 'viewHome')
    ]);
  }
};
