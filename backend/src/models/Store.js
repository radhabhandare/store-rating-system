const db = require('../config/database');

class Store {
    static async create(storeData) {
        const { name, email, address, owner_id = null } = storeData;
        const [result] = await db.execute(
            'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
            [name, email, address, owner_id]
        );
        return result.insertId;
    }

    static async findAll(filters = {}) {
        let query = `
            SELECT s.*, 
                   COALESCE(AVG(r.rating), 0) as overall_rating,
                   COUNT(DISTINCT r.user_id) as total_ratings
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE 1=1
        `;
        const params = [];
        
        if (filters.name) {
            query += ' AND s.name LIKE ?';
            params.push(`%${filters.name}%`);
        }
        if (filters.address) {
            query += ' AND s.address LIKE ?';
            params.push(`%${filters.address}%`);
        }
        
        query += ' GROUP BY s.id ORDER BY s.name';
        
        const [rows] = await db.execute(query, params);
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.execute(
            `SELECT s.*, COALESCE(AVG(r.rating), 0) as overall_rating
             FROM stores s
             LEFT JOIN ratings r ON s.id = r.store_id
             WHERE s.id = ?
             GROUP BY s.id`,
            [id]
        );
        return rows[0];
    }

    static async getUserRating(storeId, userId) {
        const [rows] = await db.execute(
            'SELECT rating FROM ratings WHERE store_id = ? AND user_id = ?',
            [storeId, userId]
        );
        return rows[0] ? rows[0].rating : null;
    }

    static async getTotalCount() {
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM stores');
        return rows[0].count;
    }

    static async update(id, storeData) {
        const { name, email, address, owner_id } = storeData;
        const [result] = await db.execute(
            'UPDATE stores SET name = ?, email = ?, address = ?, owner_id = ? WHERE id = ?',
            [name, email, address, owner_id, id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Store;