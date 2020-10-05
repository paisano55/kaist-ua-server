"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Board hasMany Post
    await queryInterface.createTable("Student_Petition", {
      StudentId: {
        type: Sequelize.UUID,
        references: {
          model: "Student", // name of Target model
          key: "id", // key in Target model that we're referencing
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      PetitionId: {
        type: Sequelize.UUID,
        references: {
          model: "Petition", // name of Target model
          key: "id", // key in Target model that we're referencing
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Student_Petition");
  },
};
