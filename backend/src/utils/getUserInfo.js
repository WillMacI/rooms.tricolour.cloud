// backend/src/utils/getUserInfo.js
const User = require('../models/User');

/**
 * Get user by UUID
 * @param {string} uuid - The UUID of the user
 * @returns {Promise<Object>} - The user data
 */
const getUserByUuid = async (uuid) => {
    try {
        const user = await User.findOne({ where: { uuid } });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        throw new Error(`Error fetching user: ${error.message}`);
    }
};

/**
 * Get user by email
 * @param {string} email - The email of the user
 * @returns {Promise<Object>} - The user data
 */
const getUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        throw new Error(`Error fetching user: ${error.message}`);
    }
};

/**
 * Get all users
 * @returns {Promise<Array>} - List of all users
 */
const getAllUsers = async () => {
    try {
        const users = await User.findAll();
        return users;
    } catch (error) {
        throw new Error(`Error fetching users: ${error.message}`);
    }
};

module.exports = {
    getUserByUuid,
    getUserByEmail,
    getAllUsers,
};