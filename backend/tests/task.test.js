const request = require('supertest');
const app = require('../server');
const db = require('../config/db');

describe('Mini Project Management Portal API Tests', () => {
  let token;
  let taskId;
  const uniqueId = Date.now();
  const testUser = {
    username: `testuser_${uniqueId}`,
    password: 'password123'
  };

  afterAll(async () => {
    // Cleanup database
    try {
      if (testUser.username) {
        const [userRows] = await db.execute('SELECT id FROM users WHERE username = ?', [testUser.username]);
        if (userRows.length > 0) {
          const userId = userRows[0].id;
          await db.execute('DELETE FROM tasks WHERE user_id = ?', [userId]);
          await db.execute('DELETE FROM users WHERE id = ?', [userId]);
        }
      }
    } catch (err) {
      console.error('Test cleanup error:', err);
    } finally {
      // Close database pool to prevent Jest from hanging
      await db.end();
    }
  });

  // Auth Tests
  describe('Authentication Endpoints', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('username', testUser.username);
    });

    it('should fail registration with duplicate username', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Username is already taken.');
    });

    it('should login user and return JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send(testUser);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      token = res.body.token;
    });
  });

  // Tasks Tests
  describe('Tasks CRUD Endpoints', () => {
    it('should fail to create task without token', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Build Login Page',
          description: 'Create a responsive login page for the app',
          status: 'Pending'
        });
      
      expect(res.statusCode).toEqual(401);
    });

    it('should fail task creation if description is less than 20 characters', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Build Login Page',
          description: 'Too short',
          status: 'Pending'
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Description must be at least 20 characters long.');
    });

    it('should create task successfully with valid data', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Build Home Page UI',
          description: 'Create a gorgeous dashboard page featuring charts and task cards.',
          status: 'Pending'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('title', 'Build Home Page UI');
      taskId = res.body.id;
    });

    it('should retrieve all tasks with pagination and status counts', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('tasks');
      expect(res.body.tasks.length).toBeGreaterThan(0);
      expect(res.body).toHaveProperty('total', 1);
    });

    it('should fetch dashboard statistics', async () => {
      const res = await request(app)
        .get('/api/tasks/stats')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('total', 1);
      expect(res.body).toHaveProperty('pending', 1);
      expect(res.body).toHaveProperty('completed', 0);
    });

    it('should update task status to Completed', async () => {
      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'Completed'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'Completed');
    });

    it('should delete task successfully', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Task deleted successfully.');
    });
  });
});
