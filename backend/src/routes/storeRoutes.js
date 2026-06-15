const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, storeController.getAllStores);
router.get('/:id', authMiddleware, storeController.getStoreDetails);
router.post('/', authMiddleware, roleMiddleware('admin'), storeController.createStore);
router.get('/admin/dashboard/stats', authMiddleware, roleMiddleware('admin'), storeController.getDashboardStats);

module.exports = router;