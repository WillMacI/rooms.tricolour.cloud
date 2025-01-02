const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const {v4: uuidv4} = require("uuid");

const Otp = sequelize.define('OTP', {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: uuidv4(),
        primaryKey: true,
        unique: true,
    },
    user_email: { // Email of the user to send OTP
        type: DataTypes.STRING,
        allowNull: false,
    },
    org_uuid: { //UUID of the organization
        type: DataTypes.UUID,
        allowNull: false,
    },
    OTP: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: true,
});

module.exports = Otp;
