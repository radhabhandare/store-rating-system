const db = require('../config/database');

class Rating {
    static async submit(userId, storeId, rating) {
        const [result] = await db.execute(
            'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?',
            [userId, storeId, rating, rating]
        );
        return result;
    }

    static async getUserRatingForStore(userId, storeId) {
        const [rows] = await db.execute(
            'SELECT rating FROM ratings WHERE user_id = ? AND store_id = ?',
            [userId, storeId]
        );
        return rows[0] ? rows[0].rating : null;
    }

    static async getStoreRatings(storeId) {
        const [rows] = await db.execute(
            `SELECT u.id, u.name, u.email, r.rating, r.created_at
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
            'SELECT AVG(rating) as average FROM ratings WHERE store_id = ?',
            [storeId]
        );
        return rows[0].average || 0;
    }
}

module.exports = Rating;