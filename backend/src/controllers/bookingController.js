const Booking = require('../models/Booking');
const bcrypt = require('bcrypt');
const { getOrganizationByUuid } = require('../utils/getOrgInfo');
const { getNumberOfBookingsThisMonth, getHoursAllowedThisMonth, getHoursUsedThisMonth, getHoursUsedOnDate, getHoursAllowedDaily } = require('../utils/bookingStatistics');
const { isRoomPublic, doesRoomExist } = require('../utils/roomsHelper');
// Create a new booking
const createBooking = async (req, res) => {
    try {
        console.log(req.body)
        // Validate input fields
        if (!req.body.room_uuid || !req.body.start_time || !req.body.end_time || !req.body.org_uuid) {
            return res.status(400).json({ error: 'Please provide all required fields. ' });
        }

        // Check that start time and end time are valid and are in date time format, also check that the booking is not occuring in the past
        if (new Date(req.body.start_time) === 'Invalid Date' || new Date(req.body.end_time) === 'Invalid Date') {
            return res.status(400).json({ error: 'Please provide a valid start and end time.' });
        } else if (new Date(req.body.start_time) > new Date(req.body.end_time)) {
            return res.status(400).json({ error: 'Start time cannot be greater than end time.' });
        } else if (new Date(req.body.start_time) < new Date()) {
            return res.status(400).json({ error: 'Start time cannot be in the past.' });
        }

        // Pull org data for info about settings
        const org = await getOrganizationByUuid(req.body.org_uuid);
        if (!org){
            return res.status(404).json({ error: 'Organization not found' });
        }

        // Check if room exists
        if (!doesRoomExist(req.body.room_uuid)) {
            console.log("Room does not exist")
            return res.status(404).json({ error: 'The room you are trying to book does not exist.' });
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

        // Check if user has exceeded the maximum number of hours allowed for the month
        const hoursAllowed = await getHoursAllowedThisMonth(req.user.uuid, req.user.org_uuid);
        const hoursUsed = await getHoursUsedThisMonth(req.user.uuid);
        const hours = Math.abs(new Date(req.body.end_time) - new Date(req.body.start_time)) / 36e5;
        if (hoursUsed + hours > hoursAllowed) {
            return res.status(403).json({ error: 'You have exceeded the maximum number of booking hours allowed for the month.' });
        }

        // Check if user is trying to book more than the maximum number of hours allowed for the day
        const hoursAllowedDaily = await getHoursAllowedDaily(req.user.uuid, req.user.org_uuid);
        const hoursUsedOnDate = await getHoursUsedOnDate(req.user.uuid, new Date(req.body.start_time));
        console.log(hoursAllowedDaily)
        console.log(hoursUsedOnDate)
        if (hoursUsedOnDate + hours > hoursAllowedDaily) {
            return res.status(403).json({ error: 'You have exceeded the maximum number of booking hours allowed for that day. You are only allowed '+hoursAllowedDaily+' booking hours per day.' });
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
        const hoursAllowed = await getHoursAllowedThisMonth(req.user.uuid, req.user.org_uuid);
        const hoursUsed = await getHoursUsedThisMonth(req.user.uuid);
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
