const express = require('express');
const userController = require('../controllers/usersController');
const router = express.Router();

// User routes
router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:uuid', userController.getUserByUUID);
router.put('/:uuid', userController.updateUserByUUID);
router.delete('/:uuid', userController.deleteUserByUUID);

module.exports = router;
