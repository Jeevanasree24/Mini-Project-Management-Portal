const Task = require('../models/Task');

exports.getAllTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, search, sortBy, sortOrder, page, limit } = req.query;

    const data = await Task.getAll(userId, {
      status,
      search,
      sortBy,
      sortOrder,
      page,
      limit
    });

    res.json(data);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, description, status } = req.body;

    // Field Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Task Title is required.' });
    }

    if (!description || description.trim().length < 20) {
      return res.status(400).json({ message: 'Description must be at least 20 characters long.' });
    }

    const validStatus = ['Pending', 'In Progress'];
    if (!status || !validStatus.includes(status)) {
      return res.status(400).json({ message: 'Status must be Pending or In Progress.' });
    }

    const newTask = await Task.create(userId, title.trim(), description.trim(), status);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ['Pending', 'In Progress', 'Completed'];
    if (!status || !allowedStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid task status.' });
    }

    const task = await Task.findById(id, userId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized.' });
    }

    const updatedTask = await Task.updateStatus(id, userId, status);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const task = await Task.findById(id, userId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized.' });
    }

    await Task.delete(id, userId);
    res.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const stats = await Task.getStats(userId);
    res.json(stats);
  } catch (error) {
    console.error('Error getting task statistics:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
