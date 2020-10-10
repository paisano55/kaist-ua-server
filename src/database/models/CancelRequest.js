'use strict';
module.exports = (sequelize, DataTypes) => {
  const CancelRequest = sequelize.define(
    'CancelRequest',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      year: DataTypes.INTEGER,
      semester: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    },
  );
  CancelRequest.associate = function (models) {
    // associations can be defined here
    CancelRequest.belongsTo(models.Student, {
      targetKey: 'studentNumber',
      foreignKey: 'studentNumber',
    });
  };
  return CancelRequest;
};
