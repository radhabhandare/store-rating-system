const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { validate, userValidations } = require('../middleware/validationMiddleware');

router.get('/', authMiddleware, roleMiddleware('admin'), userController.getAllUsers);
router.get('/:id', authMiddleware, roleMiddleware('admin'), userController.getUserDetails);
router.post('/', authMiddleware, roleMiddleware('admin'), validate(userValidations.register), userController.createUser);

module.exports = router;