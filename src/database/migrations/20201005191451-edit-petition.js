"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "Petition", // name of Source model
      "authorId", // name of the key we're adding
      {
        type: Sequelize.UUID,
        references: {
          model: "Student", // name of Target model
          key: "id", // key in Target model that we're referencing
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Petition", "authorId");
  },
};
