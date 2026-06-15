const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    static async create(userData) {
        const { name, email, password, address, role = 'user' } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, address, role]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT id, name, email, address, role, created_at FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    static async findAll(filters = {}) {
        let query = 'SELECT id, name, email, address, role FROM users WHERE 1=1';
        const params = [];
        
        if (filters.name) {
            query += ' AND name LIKE ?';
            params.push(`%${filters.name}%`);
        }
        if (filters.email) {
            query += ' AND email LIKE ?';
            params.push(`%${filters.email}%`);
        }
        if (filters.address) {
            query += ' AND address LIKE ?';
            params.push(`%${filters.address}%`);
        }
        if (filters.role && filters.role !== 'all') {
            query += ' AND role = ?';
            params.push(filters.role);
        }
        
        query += ' ORDER BY name';
        
        const [rows] = await db.execute(query, params);
        return rows;
    }

    static async updatePassword(userId, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const [result] = await db.execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, userId]
        );
        return result.affectedRows > 0;
    }

    static async getTotalCount() {
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM users');
        return rows[0].count;
    }

    static async getStoreOwnerRating(ownerId) {
        const [rows] = await db.execute(
            `SELECT AVG(r.rating) as average_rating 
             FROM ratings r 
             JOIN stores s ON r.store_id = s.id 
             WHERE s.owner_id = ?`,
            [ownerId]
        );
        return rows[0].average_rating || 0;
    }
}

module.exports = User;