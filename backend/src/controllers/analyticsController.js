const db = require('../config/database');
const Rating = require('../models/Rating');
const Store = require('../models/Store');
const User = require('../models/User');

class AnalyticsController {
    async getEnhancedStats(req, res) {
        try {
            // Get rating distribution
            const [ratingDist] = await db.execute(`
                SELECT rating, COUNT(*) as count 
                FROM ratings 
                GROUP BY rating 
                ORDER BY rating
            `);

            // Get top stores
            const [topStores] = await db.execute(`
                SELECT s.id, s.name, s.category, AVG(r.rating) as rating, COUNT(r.id) as review_count
                FROM stores s
                JOIN ratings r ON s.id = r.store_id
                GROUP BY s.id
                ORDER BY rating DESC
                LIMIT 5
            `);

            // Get recent activity
            const [recentActivity] = await db.execute(`
                SELECT a.id, u.name as userName, a.action, 
                       CASE WHEN a.action = 'RATE' THEN s.name ELSE NULL END as storeName,
                       r.rating,
                       a.created_at as createdAt
                FROM activities a
                JOIN users u ON a.user_id = u.id
                LEFT JOIN ratings r ON r.id = a.details
                LEFT JOIN stores s ON r.store_id = s.id
                ORDER BY a.created_at DESC
                LIMIT 10
            `);

            // Get monthly trends
            const [monthlyTrends] = await db.execute(`
                SELECT 
                    DATE_FORMAT(created_at, '%Y-%m') as month,
                    COUNT(*) as total_ratings,
                    AVG(rating) as avg_rating
                FROM ratings
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
                GROUP BY DATE_FORMAT(created_at, '%Y-%m')
                ORDER BY month DESC
            `);

            // Get category distribution
            const [categoryDist] = await db.execute(`
                SELECT s.category, COUNT(DISTINCT s.id) as store_count, AVG(r.rating) as avg_rating
                FROM stores s
                LEFT JOIN ratings r ON s.id = r.store_id
                GROUP BY s.category
            `);

            const totalUsers = await User.getTotalCount();
            const totalStores = await Store.getTotalCount();
            const totalRatings = await Rating.getTotalCount();
            
            const [avgRatingResult] = await db.execute('SELECT AVG(rating) as avg FROM ratings');
            const averageRating = avgRatingResult[0].avg || 0;

            res.json({
                totalUsers,
                totalStores,
                totalRatings,
                averageRating,
                ratingDistribution: ratingDist,
                topStores,
                recentActivity,
                monthlyTrends,
                categoryDistribution: categoryDist
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    async getStoreAnalytics(req, res) {
        try {
            const storeId = req.params.id;
            
            // Get rating trends
            const [trends] = await db.execute(`
                SELECT 
                    DATE_FORMAT(created_at, '%Y-%m-%d') as date,
                    COUNT(*) as count,
                    AVG(rating) as avg_rating
                FROM ratings
                WHERE store_id = ?
                GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
                ORDER BY date DESC
                LIMIT 30
            `, [storeId]);

            // Get rating breakdown
            const [breakdown] = await db.execute(`
                SELECT rating, COUNT(*) as count
                FROM ratings
                WHERE store_id = ?
                GROUP BY rating
            `, [storeId]);

            res.json({ trends, breakdown });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
}

module.exports = new AnalyticsController();