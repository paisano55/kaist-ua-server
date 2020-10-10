'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Post', 'korAuthor', {
        type: Sequelize.TEXT,
      }),
      queryInterface.addColumn('Post', 'engAuthor', {
        type: Sequelize.TEXT,
      }),
      queryInterface.removeColumn('Post', 'author'),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Post', 'korAuthor'),
      queryInterface.removeColumn('Post', 'engAuthor'),
      queryInterface.addColumn('Post', 'author', {
        type: Sequelize.TEXT,
      }),
    ]);
  },
};
