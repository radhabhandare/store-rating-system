const Store = require('../models/Store');
const User = require('../models/User');
const Rating = require('../models/Rating');

class StoreController {
    async getAllStores(req, res) {
        try {
            const filters = req.query;
            const stores = await Store.findAll(filters);
            res.json(stores);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
    
    async getStoreDetails(req, res) {
        try {
            const storeId = req.params.id;
            const store = await Store.findById(storeId);
            
            if (!store) {
                return res.status(404).json({ error: 'Store not found' });
            }
            
            if (req.user && req.user.role === 'user') {
                const userRating = await Store.getUserRating(storeId, req.user.id);
                store.user_rating = userRating;
            }
            
            res.json(store);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
    
    async createStore(req, res) {
        try {
            const { name, email, address, owner_id } = req.body;
            const storeId = await Store.create({ name, email, address, owner_id });
            res.status(201).json({ message: 'Store created successfully', storeId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
    
    async getDashboardStats(req, res) {
        try {
            const totalUsers = await User.getTotalCount();
            const totalStores = await Store.getTotalCount();
            const totalRatings = await Rating.getTotalCount();
            
            res.json({ totalUsers, totalStores, totalRatings });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
}

module.exports = new StoreController();