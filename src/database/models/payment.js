"use strict";
module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define(
        "Payment",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            studentNumber: DataTypes.STRING,
            year: DataTypes.INTEGER,
            semester: DataTypes.STRING,
        },
        {
            freezeTableName: true,
            timestamps: false,
            charset: "utf8",
            collate: "utf8_general_ci",
        }
    );
    Payment.associate = function (models) {
        // associations can be defined here
        Payment.belongsTo(models.Student);
    };
    return Payment;
};
