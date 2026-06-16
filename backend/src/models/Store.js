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
        
        // Apply filters
        if (filters.name) {
            query += ' AND s.name LIKE ?';
            params.push(`%${filters.name}%`);
        }
        if (filters.address) {
            query += ' AND s.address LIKE ?';
            params.push(`%${filters.address}%`);
        }
        if (filters.category && filters.category !== 'all' && filters.category !== '') {
            query += ' AND s.category = ?';
            params.push(filters.category);
        }
        if (filters.search) {
            query += ' AND (s.name LIKE ? OR s.address LIKE ? OR s.description LIKE ?)';
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }
        
        query += ' GROUP BY s.id';
        
        // Apply min rating filter
        if (filters.minRating && filters.minRating > 0) {
            query += ' HAVING overall_rating >= ?';
            params.push(parseFloat(filters.minRating));
        }
        
        // Apply sorting
        if (filters.sortBy) {
            switch(filters.sortBy) {
                case 'rating':
                    query += ' ORDER BY overall_rating DESC';
                    break;
                case 'reviews':
                    query += ' ORDER BY total_ratings DESC';
                    break;
                case 'name':
                    query += ' ORDER BY s.name ASC';
                    break;
                case 'newest':
                    query += ' ORDER BY s.created_at DESC';
                    break;
                default:
                    query += ' ORDER BY s.name ASC';
            }
        } else {
            query += ' ORDER BY s.name ASC';
        }
        
        // Apply pagination
        if (filters.limit) {
            query += ' LIMIT ?';
            params.push(parseInt(filters.limit));
        }
        if (filters.offset) {
            query += ' OFFSET ?';
            params.push(parseInt(filters.offset));
        }
        
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
                    COUNT(DISTINCT r.id) as total_ratings,
                    COUNT(DISTINCT r.user_id) as unique_raters
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
            total_ratings: parseInt(rows[0].total_ratings) || 0,
            unique_raters: parseInt(rows[0].unique_raters) || 0
        };
    }

    static async getUserRating(storeId, userId) {
        const [rows] = await db.execute(
            'SELECT rating, review FROM ratings WHERE store_id = ? AND user_id = ?',
            [storeId, userId]
        );
        return rows[0] || null;
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

    static async delete(id) {
        const [result] = await db.execute('DELETE FROM stores WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async getCategories() {
        const [rows] = await db.execute(`
            SELECT 
                category as name,
                COUNT(*) as store_count,
                COALESCE(AVG(r.rating), 0) as avg_rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE category IS NOT NULL AND category != ''
            GROUP BY category
            ORDER BY store_count DESC
        `);
        return rows;
    }

    static async getStoresByCategory(category) {
        const [rows] = await db.execute(`
            SELECT s.*, 
                   COALESCE(AVG(r.rating), 0) as overall_rating,
                   COUNT(DISTINCT r.id) as total_ratings
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE s.category = ?
            GROUP BY s.id
            ORDER BY overall_rating DESC, s.name ASC
        `, [category]);
        return rows;
    }

    static async getTopRated(limit = 10) {
        const [rows] = await db.execute(`
            SELECT s.*, 
                   COALESCE(AVG(r.rating), 0) as overall_rating,
                   COUNT(DISTINCT r.id) as total_ratings,
                   COUNT(DISTINCT r.user_id) as unique_raters
            FROM stores s
            INNER JOIN ratings r ON s.id = r.store_id
            GROUP BY s.id
            HAVING total_ratings >= 3
            ORDER BY overall_rating DESC, total_ratings DESC
            LIMIT ?
        `, [limit]);
        return rows;
    }

    static async getStats() {
        const [rows] = await db.execute(`
            SELECT 
                COUNT(*) as total_stores,
                COUNT(DISTINCT category) as total_categories,
                SUM(CASE WHEN owner_id IS NOT NULL THEN 1 ELSE 0 END) as stores_with_owners
            FROM stores
        `);
        return rows[0];
    }
}

module.exports = Store;