/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} - True if the email is valid, false otherwise
 */
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate UUID format
 * @param {string} uuid - The UUID to validate
 * @returns {boolean} - True if the UUID is valid, false otherwise
 */
const validateUuid = (uuid) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
};

module.exports = { validateEmail, validateUuid };