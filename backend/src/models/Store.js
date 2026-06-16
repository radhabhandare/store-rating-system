const db = require('../config/database');

class Store {
    static async create(storeData) {
        const { name, email, address, phone, category, description, owner_id = null } = storeData;
        const [result] = await db.execute(
            'INSERT INTO stores (name, email, address, phone, category, description, owner_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, email, address, phone, category, description, owner_id]
        );
        return result.insertId;
    }

    static async findAll(filters = {}) {
        let query = `
            SELECT s.*, 
                   COALESCE(CAST(AVG(r.rating) AS DECIMAL(10,2)), 0) as overall_rating,
                   COUNT(DISTINCT r.id) as total_ratings
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
        return rows.map(store => ({
            ...store,
            overall_rating: parseFloat(store.overall_rating) || 0,
            total_ratings: parseInt(store.total_ratings) || 0
        }));
    }

    static async findById(id) {
        const [rows] = await db.execute(
            `SELECT s.*, 
                    COALESCE(CAST(AVG(r.rating) AS DECIMAL(10,2)), 0) as overall_rating,
                    COUNT(DISTINCT r.id) as total_ratings
             FROM stores s
             LEFT JOIN ratings r ON s.id = r.store_id
             WHERE s.id = ?
             GROUP BY s.id`,
            [id]
        );
        if (rows.length === 0) return null;
        return {
            ...rows[0],
            overall_rating: parseFloat(rows[0].overall_rating) || 0,
            total_ratings: parseInt(rows[0].total_ratings) || 0
        };
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
        const { name, email, address, phone, category, description, owner_id } = storeData;
        const [result] = await db.execute(
            'UPDATE stores SET name = ?, email = ?, address = ?, phone = ?, category = ?, description = ?, owner_id = ? WHERE id = ?',
            [name, email, address, phone, category, description, owner_id, id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Store;