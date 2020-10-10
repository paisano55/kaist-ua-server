'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Board hasMany Post
    return queryInterface
      .addColumn(
        'Post', // name of Source model
        'boardId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Board', // name of Target model
            key: 'id', // key in Target model that we're referencing
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
      )
      .then(() => {
        // Student hasMany CancelRequest
        return queryInterface.addColumn(
          'CancelRequest', // name of Target model
          'studentNumber', // name of the key we're adding
          {
            type: Sequelize.INTEGER,
            references: {
              model: 'Student', // name of Source model
              key: 'studentNumber',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
        );
      })
      .then(() => {
        // Student hasMany Payment
        return queryInterface.addColumn(
          'Payment', // name of Target model
          'studentId', // name of the key we're adding
          {
            type: Sequelize.UUID,
            references: {
              model: 'Student', // name of Source model
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
        );
      });
  },

  down: async (queryInterface, Sequelize) => {
    // remove Board hasMany Post
    return queryInterface
      .removeColumn(
        'Post', // name of Source model
        'boardId', // key we want to remove
      )
      .then(() => {
        // remove Student hasMany CancelRequest
        return queryInterface.removeColumn(
          'CancelRequest', // name of the Target model
          'studentNumber', // key we want to remove
        );
      })
      .then(() => {
        // remove Student hasMany Payment
        return queryInterface.removeColumn(
          'Payment', // name of the Target model
          'studentId', // key we want to remove
        );
      });
  },
};
