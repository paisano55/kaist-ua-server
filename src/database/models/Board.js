"use strict";
module.exports = (sequelize, DataTypes) => {
    const Board = sequelize.define(
        "Board",
        {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            korTitle: DataTypes.STRING,
            engTitle: DataTypes.STRING,
            korDescription: DataTypes.TEXT,
            engDescription: DataTypes.TEXT,
            redirection: DataTypes.TEXT,
            viewHome: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            }
        },
        {
            freezeTableName: true,
            timestamps: false,
            charset: "utf8",
            collate: "utf8_general_ci",
        }
    );

    Board.associate = function (models) {
        models.Board.hasMany(models.Post);
        models.Board.hasMany(models.PostTag);
    };

    return Board;
};
