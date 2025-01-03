const Booking = require('../models/Booking');
const bcrypt = require('bcrypt');
const { getOrganizationByUuid } = require('../utils/getOrgInfo');
const { getNumberOfBookingsThisMonth, getHoursAllowedThisMonth, getHoursUsedThisMonth } = require('../utils/bookingStatistics');
const { isRoomPublic, doesRoomExist } = require('../utils/roomsHelper');
// Create a new booking
const createBooking = async (req, res) => {
    try {
        console.log(req.body)
        // Validate input fields
        if (!req.body.room_uuid || !req.body.start_time || !req.body.end_time || !req.body.org_uuid) {
            return res.status(400).json({ error: 'Please provide all required fields. ' });
        }

        // Check that start time and end time are valid and are in date time format
        if (new Date(req.body.start_time) === 'Invalid Date' || new Date(req.body.end_time) === 'Invalid Date') {
            return res.status(400).json({ error: 'Please provide a valid start and end time.' });
        } else if (new Date(req.body.start_time) > new Date(req.body.end_time)) {
            return res.status(400).json({ error: 'Start time cannot be greater than end time.' });
        }

        // Pull org data for info about settings
        const org = await getOrganizationByUuid(req.body.org_uuid);
        if (!org){
            console.log("Org does not exist. ")
            return res.status(404).json({ error: 'Organization not found' });
        }

        // Check if room exists
        if (!doesRoomExist(req.body.room_uuid)) {
            console.log("Room does not exist")
            return res.status(404).json({ error: 'Room not found' });
        }

        // Pull org settings for booking based on user role
        const bookingRules = org.booking_rules;
        const getBookingRulesByRole = (role) => {
            return bookingRules[req.user.role] || null;
        };

        // Check if user has correct permissions to book room if user or guest
        if(req.user.role === 'user' || req.user.role === 'guest') {
            //If the room is private
            if (!isRoomPublic(req.body.room_uuid)) {
                // Check if the user is allowed to request a private room
                if(!getBookingRulesByRole(req.user.role).can_book_private_rooms) {
                    return res.status(403).json({ error: 'You do not have permission to book this room.' });
                }
            }
        }

        // Grab user stats from past bookings
        const userNumberOfBookingsThisMonth = getNumberOfBookingsThisMonth(req.user.uuid);

        // Check if user has exceeded booking limit
        if (userNumberOfBookingsThisMonth >= getBookingRulesByRole(req.user.role).max_bookings_per_month) {
            return res.status(400).json({ error: 'You have exceeded the maximum number of bookings for this month.' });
        }

        // Calculate the number of hours between the start time and end time then check against room booking rules
        const hours = Math.abs(new Date(req.body.end_time) - new Date(req.body.start_time)) / 36e5;
        if (hours > getBookingRulesByRole(req.user.role).max_booking_hours) {
            return res.status(400).json({ error: 'You have exceeded the maximum booking hours for this room this month.' });
        }

        const booking = await Booking.create({ room_uuid: req.body.room_uuid, start_time: req.body.start_time, end_time: req.body.end_time, org_uuid: req.body.org_uuid, user_uuid: req.user.uuid });

        res.status(201).json(booking);
    } catch (error) {
        console.log(error)
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

// Get a booking by Room UUID
const getBookingsByRoomUUID = async (req, res) => {
    try {
        const bookings = await Booking.findAll({where: {room_uuid: req.params.uuid}});
        if (!bookings) return res.status(404).json({ error: 'Bookings not found for this room.' });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get bookings by user UUID
const getBookingByUserUUID = async (req, res) => {
    try {
        const bookings = await Booking.findAll({where: {user_uuid: req.params.uuid}});
        if (!bookings) return res.status(404).json({ error: 'Bookings not found for this user.' });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


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

// Get user booking statistics
const getUserStatistics = async (req, res) => {
    try {
        const hoursAllowed = getHoursAllowedThisMonth(req.user.uuid, req.user.org_uuid);
        const hoursUsed = getHoursUsedThisMonth(req.user.uuid);
        res.status(200).json({ hours_used: hoursUsed, hours_allowed: hoursAllowed });
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
    getUserStatistics,
    getBookingByUserUUID,
    getBookingsByRoomUUID
};
