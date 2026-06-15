const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validate, userValidations } = require('../middleware/validationMiddleware');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/register', validate(userValidations.register), authController.register);
router.post('/login', authController.login);
router.post('/change-password', authMiddleware, validate(userValidations.updatePassword), authController.changePassword);

module.exports = router;