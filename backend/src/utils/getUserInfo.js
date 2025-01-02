// backend/src/utils/getUserInfo.js
const User = require('../models/User');
const randomString = require('randomstring');
/**
 * Get user by UUID
 * @param {string} uuid - The UUID of the user
 * @returns {Promise<Object>} - The user data
 */
const getUserByUuid = async (uuid) => {
    try {
        const user = await User.findOne({ where: { uuid } });
        if (!user) {
            return null;
        }
        return user;
    } catch (error) {
        return null;
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
            return null;
        }
        return user;
    } catch (error) {
        return null;
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
        return null;
    }
};

/**
 * Create guest user
 * @returns {Promise<Array>} - List of all users
 */
const createGuestUser = async (email, org_uuid) => {
    try {
        const random_password = randomString.generate(10);
        const user = await User.create({
            name: 'Guest',
            email: email,
            org_uuid: org_uuid,
            password: random_password,
            role: 'guest',
        });
        return user;
    } catch (error) {
        console.log(error)
        return null;
    }
}
module.exports = {
    getUserByUuid,
    createGuestUser,
    getUserByEmail,
    getAllUsers,
};