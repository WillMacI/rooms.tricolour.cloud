// backend/src/utils/roomsHelper.js
const Room = require('../models/Room');

/**
 * Check that a room exists
 * @param {string} uuid - The UUID of the room
 * @returns {boolean} - If the room exists or not
 */
const doesRoomExist = async (uuid) => {
    try {
        const room = await Room.findByPk(uuid);
        return room ? true : false
    } catch (error) {
        return null;
    }
};

/**
 * Find if a room is private or not
 * @param {string} uuid - The UUID of the room
 * @returns {boolean} - If the room is public or not
 */
const isRoomPublic = async (uuid) => {
    try {
        const room = await Room.findByPk(uuid);
        return room.is_public;
    } catch (error) {
        return null;
    }
};

module.exports = {
    isRoomPublic,
    doesRoomExist
};