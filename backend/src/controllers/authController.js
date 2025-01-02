const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Models needed for the controller
const User = require('../models/User');
const Otp = require('../models/OTP');

// Load environment variables
require('dotenv').config({ path: './config/.env' });

// Services needed for the controller
const { sendEmail } = require('../services/emailService');
const { getOrganizationBySlug } = require('../utils/getOrgInfo');
const { getUserByEmail } = require('../utils/getUserInfo');
const { generateJWT } = require('../utils/generateJWT');

// Admin and Super Admin login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ where: { email:email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }
        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Generate JWT token
        const token = await generateJWT(user);

        res.status(200).json({ token, user: { uuid: user.uuid, role: user.role, email: user.email, name: user.name } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Send otp for user login
const send_otp = async (req, res) => {
    try {
        // Generate OTP
        const generateOtp = () => {
            return crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
        };

        // Get user data from POST
        const { email, org_slug } = req.body;

        // Get organization data
        if(await getOrganizationBySlug(org_slug) === null){
            return res.status(404).json({ error: 'Email or organization not found. ' });
        }
        const org_data = await getOrganizationBySlug(org_slug);
        const org_settings = org_data.settings.authentication;
        // Checks if signup is enabled for the organization
        if(org_settings.signup_enabled === false){
            return res.status(403).json({ error: 'Signup is disabled for this organization.' });
        }

        // Checks if domain lock is on which checks the user email against a whitelist
        if(org_settings.domain_lock === true){
            console.log(email.split('@')[1])
            if(!org_settings.domain_email_whitelist.includes(email.split('@')[1])){
                return res.status(403).json({ error: 'Email domain not allowed, domain lock is enabled for this organization. ' });
            }
        }
        const otp = generateOtp();

        try {
            // Check if user already has an OTP
            const existingOtp = await Otp.findOne({ where: { user_email: email, org_uuid: org_data.uuid } });
            if(existingOtp){
                // Update existing OTP
                await Otp.update({ OTP: otp }, { where: { user_email: email, org_uuid: org_data.uuid } });
            } else {
                // Save a new OTP to the database
                await Otp.create({ user_email: email, org_uuid: org_data.uuid, OTP: otp });
            }

            //TemplateModel for PostMark
            const templateModel = {
                "product_url": "rooms.tricolour.cloud",
                "product_name": "Room Booking System",
                "otp": otp,
            }

            // Send OTP via email
            await sendEmail(email, 'auth@tricolour.cloud', "rooms_OTP", templateModel);

            res.status(200).send('OTP sent successfully');
        } catch (error) {
            console.error('Error sending OTP:', error);
            res.status(500).send('Error sending OTP');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};

// Check OTP for user login
const check_otp = async (req, res) => {
    try {
        const { OTP, email, org_slug } = req.body;

        // Check if a user exists with the correct information
        const user = await getUserByEmail(email);

        // Check if the user is in the correct organization
        const org_data = await getOrganizationBySlug(org_slug);
        if (user.org_uuid !== org_data.uuid) {
            return res.status(401).json({ error: 'Invalid email or organization' });
        }

        // Check if the OTP is correct
        const otp = await Otp.findOne({ where: { user_email: email, org_uuid: org_data.uuid } });
        if (!otp || otp.OTP !== OTP) {
            return res.status(401).json({ error: 'Invalid OTP' });
        }

        // Generate JWT token
        const token = await generateJWT(user);

        // Delete OTP from database
        await Otp.destroy({ where: { user_email: email, org_uuid: org_data.uuid} });

        res.status(200).json({ token, user: { uuid: user.uuid, role: user.role, email: user.email, name: user.name } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { login, send_otp, check_otp };
