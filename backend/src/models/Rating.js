const db = require('../config/database');

class Rating {
    static async submit(userId, storeId, rating, review = null) {
        const [result] = await db.execute(
            'INSERT INTO ratings (user_id, store_id, rating, review) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?, review = ?',
            [userId, storeId, rating, review, rating, review]
        );
        return result;
    }

    static async getUserRatingForStore(userId, storeId) {
        const [rows] = await db.execute(
            'SELECT rating, review, created_at FROM ratings WHERE user_id = ? AND store_id = ?',
            [userId, storeId]
        );
        return rows[0] || null;
    }

    static async getStoreRatings(storeId) {
        const [rows] = await db.execute(
            `SELECT u.id, u.name, u.email, r.rating, r.review, r.created_at
             FROM ratings r
             JOIN users u ON r.user_id = u.id
             WHERE r.store_id = ?
             ORDER BY r.created_at DESC`,
            [storeId]
        );
        return rows;
    }

    static async getTotalCount() {
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM ratings');
        return rows[0].count;
    }

    static async getStoreAverageRating(storeId) {
        const [rows] = await db.execute(
            `SELECT 
                AVG(rating) as average,
                COUNT(*) as total,
                MIN(rating) as min_rating,
                MAX(rating) as max_rating
             FROM ratings 
             WHERE store_id = ?`,
            [storeId]
        );
        return {
            average: rows[0].average || 0,
            total: rows[0].total || 0,
            min: rows[0].min_rating || 0,
            max: rows[0].max_rating || 0
        };
    }

    static async getRatingDistribution(storeId = null) {
        let query = `
            SELECT 
                rating,
                COUNT(*) as count,
                ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM ratings ${storeId ? 'WHERE store_id = ?' : ''})), 1) as percentage
            FROM ratings
        `;
        const params = [];
        
        if (storeId) {
            query += ' WHERE store_id = ?';
            params.push(storeId);
        }
        
        query += ' GROUP BY rating ORDER BY rating DESC';
        
        const [rows] = await db.execute(query, params);
        return rows;
    }

    static async getUserRatingStats(userId) {
        const [rows] = await db.execute(
            `SELECT 
                COUNT(*) as total_ratings,
                AVG(rating) as avg_rating,
                MIN(rating) as min_rating,
                MAX(rating) as max_rating
             FROM ratings 
             WHERE user_id = ?`,
            [userId]
        );
        return rows[0] || { total_ratings: 0, avg_rating: 0, min_rating: 0, max_rating: 0 };
    }

    static async getRecentRatings(limit = 20) {
        const [rows] = await db.execute(
            `SELECT r.*, u.name as user_name, s.name as store_name
             FROM ratings r
             JOIN users u ON r.user_id = u.id
             JOIN stores s ON r.store_id = s.id
             ORDER BY r.created_at DESC
             LIMIT ?`,
            [limit]
        );
        return rows;
    }

    static async getOwnerStoreRatings(ownerId) {
        const [rows] = await db.execute(
            `SELECT u.id, u.name, u.email, r.rating, r.review, r.created_at, s.name as store_name
             FROM ratings r
             JOIN users u ON r.user_id = u.id
             JOIN stores s ON r.store_id = s.id
             WHERE s.owner_id = ?
             ORDER BY r.created_at DESC`,
            [ownerId]
        );
        return rows;
    }

    static async deleteRating(userId, storeId) {
        const [result] = await db.execute(
            'DELETE FROM ratings WHERE user_id = ? AND store_id = ?',
            [userId, storeId]
        );
        return result.affectedRows > 0;
    }

    static async addHelpful(userId, ratingId) {
        // Check if user already marked as helpful
        const [existing] = await db.execute(
            'SELECT id FROM helpful_votes WHERE user_id = ? AND rating_id = ?',
            [userId, ratingId]
        );
        
        if (existing.length > 0) {
            return false; // Already voted
        }
        
        await db.execute(
            'INSERT INTO helpful_votes (user_id, rating_id) VALUES (?, ?)',
            [userId, ratingId]
        );
        
        await db.execute(
            'UPDATE ratings SET helpful_count = helpful_count + 1 WHERE id = ?',
            [ratingId]
        );
        
        return true;
    }

    static async getMonthlyStats(year = null, month = null) {
        const currentYear = year || new Date().getFullYear();
        const currentMonth = month || new Date().getMonth() + 1;
        
        const [rows] = await db.execute(
            `SELECT 
                DATE_FORMAT(created_at, '%Y-%m-%d') as date,
                COUNT(*) as count,
                AVG(rating) as avg_rating,
                SUM(CASE WHEN rating >= 4 THEN 1 ELSE 0 END) as positive_count,
                SUM(CASE WHEN rating <= 2 THEN 1 ELSE 0 END) as negative_count
             FROM ratings
             WHERE YEAR(created_at) = ? AND MONTH(created_at) = ?
             GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
             ORDER BY date ASC`,
            [currentYear, currentMonth]
        );
        return rows;
    }
}

module.exports = Rating;