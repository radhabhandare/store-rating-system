const db = require('../config/database');

class Activity {
    static async log(userId, action, details = null) {
        const [result] = await db.execute(
            'INSERT INTO activities (user_id, action, details) VALUES (?, ?, ?)',
            [userId, action, details]
        );
        return result;
    }

    static async getRecentActivities(limit = 20) {
        const [rows] = await db.execute(`
            SELECT a.*, u.name as user_name, u.email as user_email
            FROM activities a
            JOIN users u ON a.user_id = u.id
            ORDER BY a.created_at DESC
            LIMIT ?
        `, [limit]);
        return rows;
    }
}

module.exports = Activity;