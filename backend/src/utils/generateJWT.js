const jwt = require('jsonwebtoken');
// Load environment variables
require('dotenv').config({ path: '../config/.env' });
/**
 * Generates a JWT for a user
 * @param {string} user - A user object with a uuid and role
 * @returns {JSON} JWT - The JWT
 */
const generateJWT = async (user) => {
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined in the environment variables');
        }
        return jwt.sign(
            { uuid: user.uuid, role: user.role },
            secret,
            { expiresIn: '1h' }
        );
    } catch (error) {
        throw new Error(`Error creating JWT: ${error.message}`);
    }
};

module.exports = { generateJWT };