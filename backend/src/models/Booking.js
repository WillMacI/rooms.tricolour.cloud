const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Room = require('./Room');
const Organization = require('./Organization');

const Booking = sequelize.define('Booking', {
    uuid: {
        type: DataTypes.CHAR(36),
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
