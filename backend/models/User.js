const db = require('../config/db');

class User {
  static async create(username, passwordHash) {
    const [result] = await db.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, passwordHash]
    );
    return { id: result.insertId, username };
  }

  static async findByUsername(username) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT id, username, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }
}

module.exports = User;
