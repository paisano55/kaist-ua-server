'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      korAuthor: DataTypes.TEXT,
      engAuthor: DataTypes.TEXT,
      korTitle: DataTypes.TEXT,
      engTitle: DataTypes.TEXT,
      korContent: DataTypes.TEXT,
      engContent: DataTypes.TEXT,
      views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      isActive: DataTypes.BOOLEAN,
      isNew: {
        type: DataTypes.VIRTUAL,
        get() {
          return new Date(this.createdAt) > Date.now() - 1000 * 60 * 60 * 24;
        },
      },
    },
    {
      freezeTableName: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    },
  );

  Post.associate = function (models) {
    models.Post.belongsTo(models.Board, { foreignKey: 'boardId' });
  };

  return Post;
};
