const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/login', authController.login);
router.post('/send-otp', authController.send_otp);
router.post('/check-otp', authController.check_otp);

module.exports = router;
