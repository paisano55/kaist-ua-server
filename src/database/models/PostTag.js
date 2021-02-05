"use strict";
module.exports = (sequelize, DataTypes) => {
  const PostTag = sequelize.define(
    "PostTag",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      korName: DataTypes.TEXT,
      engName: DataTypes.TEXT,
    },
    {
      freezeTableName: true,
      charset: "utf8",
      collate: "utf8_general_ci",
      timestamps: false,
    }
  );
  PostTag.associate = function (models) {
    // associations can be defined here
    PostTag.belongsToMany(models.Post, { through: "Post_PostTag" });
    PostTag.belongsTo(models.Board);
  };
  return PostTag;
};
