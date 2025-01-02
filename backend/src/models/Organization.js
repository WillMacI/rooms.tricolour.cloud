const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const {v4: uuidv4} = require("uuid");

const Organization = sequelize.define('Organization', {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: uuidv4(),
        primaryKey: true,
        unique: true,
    },
    slug: { //Used for URLs when the UUID would be non-user friendly or too long
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    super_admin_uuid: { //UUID of the super admin user
        type: DataTypes.UUID,
        allowNull: false,
    },
    logo_path: { //Path to the organization's logo
        type: DataTypes.STRING,
        allowNull: true,
    },
    primary_color: { //Primary color of the organization
        type: DataTypes.JSON,
        allowNull: true,
    },
    booking_rules: { //Rules for booking rooms
        type: DataTypes.JSON,
        allowNull: true,
    },
    settings: { //Settings for the organization
        type: DataTypes.JSON,
        allowNull: true
    }

}, {
    timestamps: true,
});

module.exports = Organization;
