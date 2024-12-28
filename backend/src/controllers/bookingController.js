const Booking = require('../models/Booking');
const bcrypt = require('bcrypt');

// Create a new booking
const createBooking = async (req, res) => {
    try {
        const booking = await Booking.create(req.body);

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all bookings
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a booking by UUID
const getBookingByUUID = async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.uuid);
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a booking by Organization
const getBookingsByOrg = async (req, res) => {
    try {
        const bookings = await Booking.findAll({where: {org_uuid: req.params.organization}});
        if (!bookings) return res.status(404).json({ error: 'Organization or bookings not found.' });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a booking by UUID
const updateBookingByUUID = async (req, res) => {
    try {
        const [updated] = await Booking.update(req.body, {
            where: { uuid: req.params.uuid },
        });
        if (!updated) return res.status(404).json({ error: 'Booking not found' });
        res.status(200).json({ message: 'Booking updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a booking by UUID
const deleteBookingByUUID = async (req, res) => {
    try {
        const deleted = await Booking.destroy({
            where: { uuid: req.params.uuid },
        });
        if (!deleted) return res.status(404).json({ error: 'Booking not found' });
        res.status(200).json({ message: 'Booking deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createBooking,
    getAllBookings,
    getBookingByUUID,
    updateBookingByUUID,
    deleteBookingByUUID,
    getBookingsByOrg,
};
