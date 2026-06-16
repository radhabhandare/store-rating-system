const db = require('../config/database');

class ExportService {
    async exportStoresToCSV() {
        const [stores] = await db.execute(`
            SELECT 
                s.name as 'Store Name',
                s.email as 'Email',
                s.address as 'Address',
                COALESCE(AVG(r.rating), 0) as 'Average Rating',
                COUNT(r.id) as 'Total Ratings'
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            GROUP BY s.id
            ORDER BY 'Average Rating' DESC
        `);
        return stores;
    }

    async exportUsersToCSV() {
        const [users] = await db.execute(`
            SELECT 
                name as 'Name',
                email as 'Email',
                role as 'Role',
                address as 'Address',
                created_at as 'Registered Date',
                (SELECT COUNT(*) FROM ratings WHERE user_id = users.id) as 'Ratings Given'
            FROM users
            ORDER BY created_at DESC
        `);
        return users;
    }
}

module.exports = new ExportService();