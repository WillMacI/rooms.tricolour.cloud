const express = require('express');
const orgController = require('../controllers/orgController');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Org routes
router.post('/', authenticate, authorize(['super_admin']), orgController.createOrg);
router.get('/', authenticate, authorize(['super_admin']), orgController.getAllOrgs);
router.get('/uuid/:uuid', authenticate, authorize(['admin']), orgController.getOrgByUUID);
router.put('/:uuid', authenticate, authorize(['super_admin']), orgController.updateOrgByUUID);
router.delete('/:uuid', authenticate, authorize(['super_admin']), orgController.deleteOrgByUUID);

module.exports = router;
