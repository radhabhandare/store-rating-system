const User = require('../models/User');

class UserController {
    async getAllUsers(req, res) {
        try {
            const filters = req.query;
            const users = await User.findAll(filters);
            
            const usersWithRatings = await Promise.all(users.map(async (user) => {
                if (user.role === 'owner') {
                    const rating = await User.getStoreOwnerRating(user.id);
                    return { ...user, rating: parseFloat(rating).toFixed(2) };
                }
                return user;
            }));
            
            res.json(usersWithRatings);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
    
    async getUserDetails(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId);
            
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            
            if (user.role === 'owner') {
                const rating = await User.getStoreOwnerRating(userId);
                user.rating = parseFloat(rating).toFixed(2);
            }
            
            res.json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
    
    async createUser(req, res) {
        try {
            const { name, email, password, address, role } = req.body;
            
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: 'Email already registered' });
            }
            
            const userId = await User.create({ name, email, password, address, role });
            res.status(201).json({ message: 'User created successfully', userId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
}

module.exports = new UserController();