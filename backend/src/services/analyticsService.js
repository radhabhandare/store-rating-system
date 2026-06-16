const db = require('../config/database');

class AnalyticsService {
    async getAdvancedStats() {
        const [results] = await db.execute(`
            SELECT 
                (SELECT COUNT(*) FROM users) as total_users,
                (SELECT COUNT(*) FROM stores) as total_stores,
                (SELECT COUNT(*) FROM ratings) as total_ratings,
                (SELECT AVG(rating) FROM ratings) as avg_rating,
                (SELECT COUNT(*) FROM users WHERE created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)) as new_users_week,
                (SELECT COUNT(*) FROM ratings WHERE created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)) as new_ratings_week,
                (SELECT COUNT(*) FROM users WHERE role = 'owner') as total_owners,
                (SELECT COUNT(*) FROM stores WHERE owner_id IS NOT NULL) as stores_with_owners,
                (SELECT COUNT(*) FROM users WHERE role = 'user') as total_normal_users
        `);
        return results[0];
    }

    async getRatingTrends(days = 30) {
        const [results] = await db.execute(`
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m-%d') as date,
                COUNT(*) as count,
                AVG(rating) as avg_rating
            FROM ratings
            WHERE created_at > DATE_SUB(NOW(), INTERVAL ? DAY)
            GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
            ORDER BY date ASC
        `, [days]);
        return results;
    }

    async getTopRatedStores(limit = 10) {
        const [results] = await db.execute(`
            SELECT 
                s.id,
                s.name,
                s.email,
                AVG(r.rating) as avg_rating,
                COUNT(r.id) as total_ratings
            FROM stores s
            JOIN ratings r ON s.id = r.store_id
            GROUP BY s.id
            ORDER BY avg_rating DESC
            LIMIT ?
        `, [limit]);
        return results;
    }

    async getUserActivityStats() {
        const [results] = await db.execute(`
            SELECT 
                u.id,
                u.name,
                u.email,
                u.role,
                COUNT(r.id) as total_ratings_given,
                AVG(r.rating) as avg_rating_given
            FROM users u
            LEFT JOIN ratings r ON u.id = r.user_id
            GROUP BY u.id
            ORDER BY total_ratings_given DESC
            LIMIT 20
        `);
        return results;
    }
}

module.exports = new AnalyticsService();