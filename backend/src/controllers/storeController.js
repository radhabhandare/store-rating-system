const Store = require('../models/Store');
const User = require('../models/User');
const Rating = require('../models/Rating');
const db = require('../config/database');

class StoreController {
    async getAllStores(req, res) {
        try {
            const filters = req.query;
            
            // If search is provided, use direct DB query for better filtering
            if (filters.search || filters.category || filters.minRating || filters.sortBy) {
                let query = `
                    SELECT s.*, 
                           COALESCE(CAST(AVG(r.rating) AS DECIMAL(10,2)), 0) as overall_rating,
                           COUNT(DISTINCT r.id) as total_ratings
                    FROM stores s
                    LEFT JOIN ratings r ON s.id = r.store_id
                    WHERE 1=1
                `;
                const params = [];
                
                if (filters.search) {
                    query += ' AND (s.name LIKE ? OR s.address LIKE ?)';
                    params.push(`%${filters.search}%`, `%${filters.search}%`);
                }
                if (filters.category && filters.category !== 'all' && filters.category !== '') {
                    query += ' AND s.category = ?';
                    params.push(filters.category);
                }
                
                query += ' GROUP BY s.id';
                
                if (filters.minRating && filters.minRating > 0) {
                    query += ' HAVING overall_rating >= ?';
                    params.push(parseFloat(filters.minRating));
                }
                
                if (filters.sortBy === 'rating') {
                    query += ' ORDER BY overall_rating DESC';
                } else if (filters.sortBy === 'reviews') {
                    query += ' ORDER BY total_ratings DESC';
                } else if (filters.sortBy === 'name') {
                    query += ' ORDER BY s.name ASC';
                } else {
                    query += ' ORDER BY s.name ASC';
                }
                
                const [rows] = await db.execute(query, params);
                
                const stores = rows.map(store => ({
                    ...store,
                    overall_rating: parseFloat(store.overall_rating) || 0,
                    total_ratings: parseInt(store.total_ratings) || 0
                }));
                
                return res.json(stores);
            }
            
            // If no filters, use the model method
            const stores = await Store.findAll(filters);
            const processedStores = stores.map(store => ({
                ...store,
                overall_rating: parseFloat(store.overall_rating) || 0,
                total_ratings: parseInt(store.total_ratings) || 0
            }));
            res.json(processedStores);
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
            
            // Ensure numeric values
            store.overall_rating = parseFloat(store.overall_rating) || 0;
            store.total_ratings = parseInt(store.total_ratings) || 0;
            
            if (req.user && req.user.role === 'user') {
                const userRating = await Store.getUserRating(storeId, req.user.id);
                store.user_rating = userRating ? parseInt(userRating) : null;
            }
            
            res.json(store);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
    
    async createStore(req, res) {
        try {
            const { name, email, address, phone, category, description, owner_id } = req.body;
            
            // Validate required fields
            if (!name || !email || !address) {
                return res.status(400).json({ error: 'Name, email and address are required' });
            }
            
            const storeId = await Store.create({ 
                name, 
                email, 
                address, 
                phone: phone || null,
                category: category || null,
                description: description || null,
                owner_id: owner_id || null 
            });
            
            res.status(201).json({ message: 'Store created successfully', storeId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
    
    async getCategories(req, res) {
        try {
            // Try to get categories from database
            const [categories] = await db.execute(
                'SELECT id, name, icon FROM categories ORDER BY name'
            );
            
            if (categories && categories.length > 0) {
                res.json(categories);
            } else {
                // Return default categories if table is empty
                res.json([
                    { id: 1, name: 'Grocery', icon: '🛒' },
                    { id: 2, name: 'Electronics', icon: '📱' },
                    { id: 3, name: 'Fashion', icon: '👕' },
                    { id: 4, name: 'Restaurant', icon: '🍔' },
                    { id: 5, name: 'Coffee Shop', icon: '☕' },
                    { id: 6, name: 'Bookstore', icon: '📚' },
                    { id: 7, name: 'Pharmacy', icon: '💊' },
                    { id: 8, name: 'Fitness', icon: '💪' },
                    { id: 9, name: 'Home Decor', icon: '🏠' },
                    { id: 10, name: 'Pet Store', icon: '🐕' }
                ]);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Return default categories on error
            res.json([
                { id: 1, name: 'Grocery', icon: '🛒' },
                { id: 2, name: 'Electronics', icon: '📱' },
                { id: 3, name: 'Fashion', icon: '👕' },
                { id: 4, name: 'Restaurant', icon: '🍔' },
                { id: 5, name: 'Coffee Shop', icon: '☕' }
            ]);
        }
    }
    
    async getDashboardStats(req, res) {
        try {
            const totalUsers = await User.getTotalCount();
            const totalStores = await Store.getTotalCount();
            const totalRatings = await Rating.getTotalCount();
            
            res.json({ 
                totalUsers: parseInt(totalUsers) || 0, 
                totalStores: parseInt(totalStores) || 0, 
                totalRatings: parseInt(totalRatings) || 0 
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
}

module.exports = new StoreController();