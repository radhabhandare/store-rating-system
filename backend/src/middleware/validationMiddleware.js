const { body, validationResult } = require('express-validator');

const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        
        res.status(400).json({ errors: errors.array() });
    };
};

const userValidations = {
    register: [
        body('name').isLength({ min: 20, max: 60 }).withMessage('Name must be between 20 and 60 characters'),
        body('email').isEmail().withMessage('Must be a valid email'),
        body('password')
            .isLength({ min: 8, max: 16 })
            .withMessage('Password must be 8-16 characters')
            .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/).withMessage('Password must contain at least one uppercase letter and one special character'),
        body('address').isLength({ max: 400 }).withMessage('Address must not exceed 400 characters')
    ],
    updatePassword: [
        body('currentPassword').notEmpty().withMessage('Current password is required'),
        body('newPassword')
            .isLength({ min: 8, max: 16 })
            .withMessage('Password must be 8-16 characters')
            .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/).withMessage('Password must contain at least one uppercase letter and one special character')
    ],
    createStore: [
        body('name').notEmpty().withMessage('Store name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('address').notEmpty().withMessage('Address is required')
    ]
};

module.exports = { validate, userValidations };