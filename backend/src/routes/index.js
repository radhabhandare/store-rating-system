const express = require('express');
const router = express.Router();

const authRoutes = require('./v1/authRoutes');
const userRoutes = require('./v1/userRoutes');
const storeRoutes = require('./v1/storeRoutes');
const ratingRoutes = require('./v1/ratingRoutes');
const analyticsRoutes = require('./v1/analyticsRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/stores', storeRoutes);
router.use('/ratings', ratingRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;