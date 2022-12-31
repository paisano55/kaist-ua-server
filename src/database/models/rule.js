"use strict";
module.exports = (sequelize, DataTypes) => {
    const Rule = sequelize.define(
        "Rule",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            parentId: DataTypes.INTEGER,
            korTitle: DataTypes.TEXT,
            engTitle: DataTypes.TEXT,
            korContent: DataTypes.TEXT,
            engContent: DataTypes.TEXT,
        },
        {
            freezeTableName: true,
            charset: "utf8",
            collate: "utf8_general_ci",
        }
    );

    return Rule;
};
