const db = require('../config/db');

class Task {
  static async create(userId, title, description, status) {
    const [result] = await db.execute(
      'INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)',
      [userId, title, description, status]
    );
    return this.findById(result.insertId, userId);
  }

  static async findById(id, userId) {
    const [rows] = await db.execute(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0];
  }

  static async getAll(userId, { status, search, sortBy = 'created_at', sortOrder = 'DESC', page = 1, limit = 5 }) {
    let query = 'SELECT * FROM tasks WHERE user_id = ?';
    let countQuery = 'SELECT COUNT(*) as total FROM tasks WHERE user_id = ?';
    const params = [userId];
    const countParams = [userId];

    // Status filter
    if (status && status !== 'All') {
      query += ' AND status = ?';
      countQuery += ' AND status = ?';
      params.push(status);
      countParams.push(status);
    }

    // Search filter
    if (search) {
      const searchPattern = `%${search}%`;
      query += ' AND (title LIKE ? OR description LIKE ?)';
      countQuery += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(searchPattern, searchPattern);
      countParams.push(searchPattern, searchPattern);
    }

    // Sorting - whitelist columns to prevent SQL injection
    const allowedSortBy = ['created_at', 'title', 'status'];
    const finalSortBy = allowedSortBy.includes(sortBy) ? sortBy : 'created_at';
    const finalSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${finalSortBy} ${finalSortOrder}`;

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 5;
    const offset = (pageNum - 1) * limitNum;

    query += ' LIMIT ? OFFSET ?';
    params.push(limitNum, offset);

    // Get total count
    const [countResult] = await db.execute(countQuery, countParams);
    const total = countResult[0].total;

    // Get tasks
    const [rows] = await db.query(query, params);

    return {
      tasks: rows,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum)
    };
  }

  static async updateStatus(id, userId, status) {
    await db.execute(
      'UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?',
      [status, id, userId]
    );
    return this.findById(id, userId);
  }

  static async delete(id, userId) {
    const [result] = await db.execute(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  }

  static async getStats(userId) {
    const [rows] = await db.execute(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as inProgress,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed
       FROM tasks WHERE user_id = ?`,
      [userId]
    );
    
    const stats = rows[0];
    return {
      total: parseInt(stats.total) || 0,
      pending: parseInt(stats.pending) || 0,
      inProgress: parseInt(stats.inProgress) || 0,
      completed: parseInt(stats.completed) || 0
    };
  }
}

module.exports = Task;
