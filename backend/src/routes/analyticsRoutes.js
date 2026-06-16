const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

router.get('/dashboard', authMiddleware, roleMiddleware('admin'), analyticsController.getEnhancedStats);
router.get('/store/:id', authMiddleware, analyticsController.getStoreAnalytics);

module.exports = router;