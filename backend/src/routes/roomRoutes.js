const express = require('express');
const roomController = require('../controllers/roomController');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Room routes
router.post('/', authenticate, authorize(['super_admin', 'admin']), roomController.createRoom);
router.get('/', authenticate, authorize(['super_admin']), roomController.getAllRooms);
router.get('/uuid/:uuid', authenticate, roomController.getRoomByUUID);
router.get('/org/:organization', authenticate, roomController.getRoomsByOrg);
router.put('/:uuid', authorize(['super_admin', 'admin']), roomController.updateRoomByUUID);
router.delete('/:uuid', authenticate, authorize(['super_admin', 'org_admin']), roomController.deleteRoomByUUID);

module.exports = router;
