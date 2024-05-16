const db = require('../config/bd');

const User = {
    getAll: async () => {
        try {
            const [rows, fields] = await db.execute('SELECT * FROM users');
            return rows;
        } catch (error) {
            throw error;
        }
    },
    create: async (userData) => {
        try {
            const { name, email, PhoneNo, password, DematAcc } = userData;
            const [result] = await db.execute(
                'INSERT INTO users (name, email, PhoneNo, password, DematAcc) VALUES (?, ?, ?, ?, ?)',
                [name, email, PhoneNo, password, JSON.stringify(DematAcc)]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    },
    // Add other CRUD methods as needed
};

module.exports = User;
