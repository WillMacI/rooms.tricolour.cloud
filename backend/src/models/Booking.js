const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Room = require('./Room');
const Organization = require('./Organization');
const {v4: uuidv4} = require("uuid");

const Booking = sequelize.define('Booking', {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        primaryKey: true
    },
    start_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    timestamps: true,
});

// Define associations
Booking.belongsTo(User, { foreignKey: 'user_uuid', onDelete: 'CASCADE' });
Booking.belongsTo(Room, { foreignKey: 'room_uuid', onDelete: 'CASCADE' });
Booking.belongsTo(Organization, { foreignKey: 'org_uuid', onDelete: 'CASCADE' });

module.exports = Booking;
