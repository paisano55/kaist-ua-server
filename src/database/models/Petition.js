"use strict";
module.exports = (sequelize, DataTypes) => {
  const Petition = sequelize.define(
    "Petition",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      StudentId: DataTypes.UUID,
      korTitle: DataTypes.TEXT,
      engTitle: DataTypes.TEXT,
      korContent: DataTypes.TEXT,
      engContent: DataTypes.TEXT,
      isActive: {
        type: DataTypes.VIRTUAL,
        get() {
          return (
            new Date(this.createdAt) > Date.now() - 1000 * 60 * 60 * 24 * 14
          );
        },
      },
      isNew: {
        type: DataTypes.VIRTUAL,
        get() {
          return new Date(this.createdAt) > Date.now() - 1000 * 60 * 60 * 24;
        },
      },
    },
    {
      freezeTableName: true,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );

  Petition.associate = function (models) {
    Petition.belongsToMany(models.Student, { through: "Student_Petition" });
    Petition.belongsTo(models.Student);
  };

  return Petition;
};
