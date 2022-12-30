"use strict";
module.exports = (sequelize, DataTypes) => {
    const Deadline = sequelize.define(
        "Deadline",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            year: DataTypes.INTEGER,
            semester: DataTypes.STRING,
            due: DataTypes.DATE,
        },
        {
            freezeTableName: true,
            charset: "utf8",
            collate: "utf8_general_ci",
        }
    );
    Deadline.associate = function (models) {
        // associations can be defined here
    };
    return Deadline;
};
