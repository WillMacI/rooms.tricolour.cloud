const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Organization = sequelize.define('Organization', {
    uuid: {
        type: DataTypes.CHAR(36),
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    super_admin_uuid: {
        type: DataTypes.CHAR(36),
        allowNull: false,
    },
}, {
    timestamps: true,
});

module.exports = Organization;
