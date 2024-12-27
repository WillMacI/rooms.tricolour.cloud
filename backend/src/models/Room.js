const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Organization = require("./Organization");

const Room = sequelize.define('Room', {
    uuid: {
        type: DataTypes.CHAR(36),
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    features: {
        type: DataTypes.JSON,
        allowNull: true, // Array of features (e.g., ['projector', 'whiteboard'])
    }
}, {
    timestamps: true,
});

Room.belongsTo(Organization, { foreignKey: 'org_uuid', onDelete: 'CASCADE' });

module.exports = Room;
