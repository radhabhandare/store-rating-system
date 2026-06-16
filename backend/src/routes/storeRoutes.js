const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// Public routes (with auth)
router.get('/', authMiddleware, storeController.getAllStores);
router.get('/categories', authMiddleware, storeController.getCategories);
router.get('/:id', authMiddleware, storeController.getStoreDetails);

// Admin only routes
router.post('/', authMiddleware, roleMiddleware('admin'), storeController.createStore);
router.get('/admin/dashboard/stats', authMiddleware, roleMiddleware('admin'), storeController.getDashboardStats);

module.exports = router;