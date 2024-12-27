const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const Organization = require('./Organization');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: uuidv4(),
        primaryKey: true,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('super_admin', 'org_admin', 'user', 'guest'),
        defaultValue: 'guest',
    },
}, {
    timestamps: true,
    hooks: {
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        },
    },
});

// Define associations
User.belongsTo(Organization, { foreignKey: 'org_uuid', onDelete: 'CASCADE' });


module.exports = User;
