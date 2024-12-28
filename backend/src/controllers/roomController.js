const Room = require('../models/Room');
const bcrypt = require('bcrypt');

// Create a new Room
const createRoom = async (req, res) => {
    try {
        const room = await Room.create(req.body);

        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all Rooms
const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.findAll();
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a Room by UUID
const getRoomByUUID = async (req, res) => {
    try {
        const room = await Room.findByPk(req.params.uuid);
        if (!room) return res.status(404).json({ error: 'Room not found' });
        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a Room by Organization
const getRoomsByOrg = async (req, res) => {
    try {
        const rooms = await Room.findAll({where: {org_uuid: req.params.organization}});
        if (!rooms) return res.status(404).json({ error: 'Organization or Rooms not found.' });
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a Room by UUID
const updateRoomByUUID = async (req, res) => {
    try {
        const [updated] = await Room.update(req.body, {
            where: { uuid: req.params.uuid },
        });
        if (!updated) return res.status(404).json({ error: 'Room not found' });
        res.status(200).json({ message: 'Room updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a Room by UUID
const deleteRoomByUUID = async (req, res) => {
    try {
        const deleted = await Room.destroy({
            where: { uuid: req.params.uuid },
        });
        if (!deleted) return res.status(404).json({ error: 'Room not found' });
        res.status(200).json({ message: 'Room deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createRoom,
    getAllRooms,
    getRoomByUUID,
    updateRoomByUUID,
    deleteRoomByUUID,
    getRoomsByOrg,
};
