// backend/src/utils/bookingStatistics.js
const Booking = require('../models/Booking');
const User = require('../models/User');
const Organization = require('../models/Organization');
const { Op } = require('sequelize');
const moment = require('moment-timezone');

/**
 * Get total bookings for a user per month
 * @param {string} uuid - The UUID of the user
 * @returns {int} - The number of bookings the user has made in the current month
 */
const getNumberOfBookingsThisMonth = async (uuid) => {
    try {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const bookings = await Booking.findAll({
            where: {
                user_uuid: uuid,
                createdAt: {
                    [Op.between]: [firstDay, lastDay]
                }
            }
        });
        return bookings.length;
    } catch (error) {
        return null;
    }
};

/**
 * Get number of hours used by a user this month
 * @param {string} uuid - The UUID of the user
 * @returns {int} - The number of hours used by the user this month
 */
const getHoursUsedThisMonth = async (uuid) => {
    try {
        const bookings = await Booking.findAll({
            where: {
                user_uuid: uuid,
                createdAt: {
                    [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
            }
        });
        return bookings.reduce((acc, booking) => {
            const start = new Date(booking.start_time);
            const end = new Date(booking.end_time);
            return acc + (end - start) / 1000 / 60 / 60;
        }, 0);
    } catch (error) {
        console.log(error)
        return null;
    }
}

/**
 * Get total number of hours that a user can book for the current organization this month
 * @param {string} user_uuid - The UUID of the user
 * @param {string} org_uuid - The UUID of the org
 * @returns {int} - The number of hours the user can book this month within the organization and role
 */
const getHoursAllowedThisMonth = async (user_uuid, org_uuid) => {
    try {
        const user = await User.findByPk(user_uuid);
        const org = await Organization.findByPk(org_uuid);
        const org_settings = org.booking_rules;
        const getBookingRulesByRole = (role) => {
            return org_settings[role] || null;
        };
        console.log(getBookingRulesByRole(user.role).max_booking_hours_per_month)
        return getBookingRulesByRole(user.role).max_booking_hours_per_month;
    } catch (error) {
        console.log(error)
        return null;
    }
}

/**
 * Get number of hours used by a user today
 * @param {string} uuid - The UUID of the user
 * @returns {int} - The number of hours used by the user this month
 */
const getHoursUsedOnDate = async (uuid, date) => {
    try {
        const startOfDay = moment.tz(date, 'America/Toronto').startOf('day').toDate();
        const endOfDay = moment.tz(date, 'America/Toronto').endOf('day').toDate();
        console.log(startOfDay)
        console.log(endOfDay)
        const bookings = await Booking.findAll({
            where: {
                user_uuid: uuid,
                start_time: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            }
        });
        return bookings.reduce((acc, booking) => {
            const start = new Date(booking.start_time);
            const end = new Date(booking.end_time);
            return acc + (end - start) / 1000 / 60 / 60;
        }, 0);
    } catch (error) {
        console.log(error);
        return null;
    }
};
/**
 * Get total number of hours that a user can book for the current organization daily
 * @param {string} user_uuid - The UUID of the user
 * @param {string} org_uuid - The UUID of the org
 * @returns {int} - The number of hours the user can book this month within the organization and role
 */
const getHoursAllowedDaily = async (user_uuid, org_uuid) => {
    try {
        const user = await User.findByPk(user_uuid);
        const org = await Organization.findByPk(org_uuid);
        const org_settings = org.booking_rules;
        const getBookingRulesByRole = (role) => {
            return org_settings[role] || null;
        };
        return getBookingRulesByRole(user.role).max_booking_hours_per_day;
    } catch (error) {
        console.log(error)
        return null;
    }
}

module.exports = {
    getNumberOfBookingsThisMonth,
    getHoursAllowedThisMonth,
    getHoursUsedThisMonth,
    getHoursUsedOnDate,
    getHoursAllowedDaily
};