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
            timestamps: false,
            charset: "utf8",
            collate: "utf8_general_ci",
        }
    );
    return Deadline;
};
