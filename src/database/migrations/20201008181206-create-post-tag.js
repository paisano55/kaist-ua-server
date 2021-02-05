"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.createTable("PostTag", {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        korName: Sequelize.TEXT,
        engName: Sequelize.TEXT,
        BoardId: {
          type: Sequelize.INTEGER,
          references: {
            model: "Board", // name of Source model
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
      }),
      queryInterface.createTable("Post_PostTag", {
        PostId: {
          type: Sequelize.UUID,
          references: {
            model: "Post", // name of Target model
            key: "id", // key in Target model that we're referencing
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        PostTagId: {
          type: Sequelize.UUID,
          references: {
            model: "PostTag", // name of Target model
            key: "id", // key in Target model that we're referencing
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.dropTable("Post_PostTag"),
      queryInterface.dropTable("PostTag"),
    ]);
  },
};
