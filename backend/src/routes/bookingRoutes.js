const express = require('express');
const bookingController = require('../controllers/bookingController');
const router = express.Router();
const { authenticate, authorize, orgCheck} = require('../middleware/authMiddleware');

// Booking routes
router.post('/', authenticate, bookingController.createBooking);
router.get('/', authenticate, authorize(['super_admin']), bookingController.getAllBookings);
router.get('/uuid/:uuid', authenticate, bookingController.getBookingByUUID);
router.get('/room/:uuid', authenticate, bookingController.getBookingsByRoomUUID);
router.get('/org/:organization', authenticate, orgCheck, bookingController.getBookingsByOrg);
router.get('/user/:uuid', authenticate, orgCheck, bookingController.getBookingByUserUUID);
router.get('/statistics/:uuid', authenticate, orgCheck, bookingController.getUserStatistics);

router.put('/:uuid', authorize(['super_admin', 'admin']), bookingController.updateBookingByUUID);
router.delete('/:uuid', authenticate, authorize(['super_admin', 'org_admin']), bookingController.deleteBookingByUUID);

module.exports = router;
