const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {
    async register(req, res) {
        try {
            const { name, email, password, address } = req.body;
            
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: 'Email already registered' });
            }
            
            const userId = await User.create({ name, email, password, address, role: 'user' });
            res.status(201).json({ message: 'User registered successfully', userId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
    
    async login(req, res) {
        try {
            const { email, password } = req.body;
            
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role, name: user.name },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            
            res.json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
    
    async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user.id;
            
            const user = await User.findByEmail(req.user.email);
            const isValidPassword = await bcrypt.compare(currentPassword, user.password);
            
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Current password is incorrect' });
            }
            
            await User.updatePassword(userId, newPassword);
            res.json({ message: 'Password updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
}

module.exports = new AuthController();