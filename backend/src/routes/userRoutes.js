const express = require('express');
const userController = require('../controllers/usersController');
const router = express.Router();
const { authenticate, authorize, orgCheck, ownerCheck} = require('../middleware/authMiddleware');

// User routes
router.post('/', authenticate, authorize(['super_admin', 'admin']), orgCheck, userController.createUser);
router.get('/', authenticate, authorize(['super_admin']), userController.getAllUsers);
router.get('/uuid/:uuid', authenticate, ownerCheck, userController.getUserByUUID);
router.get('/org/:organization', authenticate, authorize(['super_admin', 'org_admin']), orgCheck, userController.getUserByOrg);
router.put('/:uuid', authenticate, userController.updateUserByUUID);
router.delete('/:uuid', authenticate, authorize(['super_admin', 'org_admin']), userController.deleteUserByUUID);

module.exports = router;
