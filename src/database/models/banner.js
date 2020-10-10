'use strict';
module.exports = (sequelize, DataTypes) => {
  const Banner = sequelize.define(
    'Banner',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      image: DataTypes.TEXT,
      link: DataTypes.TEXT,
      isActive: DataTypes.BOOLEAN,
    },
    {
      freezeTableName: true,
      timestamps: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    },
  );
  Banner.associate = function (models) {
    // associations can be defined here
  };
  return Banner;
};
