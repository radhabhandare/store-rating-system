const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, roleMiddleware('user'), ratingController.submitRating);
router.get('/store/:storeId', authMiddleware, ratingController.getStoreRatings);
router.get('/owner/ratings', authMiddleware, roleMiddleware('owner'), ratingController.getOwnerStoreRatings);

module.exports = router;