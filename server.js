import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// async function authMiddleware(req, res, next) {
//   const authHeader = req.headers.authorization || "";
//   const token = authHeader.replace("Bearer ", "");

//   // TODO: Verify token using Asgardeo’s JWKS / library for your framework.
//   const payload = verifyWithAsgardeo(token); // returns decoded token

//   req.user = {
//     id: payload.sub, // unique user id from Asgardeo
//   };

//   next();
// }

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Routes

// GET all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT task_id, description, due_date, status FROM tasks ORDER BY due_date ASC'
    );
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks', details: error.message });
  }
});

// POST new task
app.post('/api/tasks', async (req, res) => {
  const { description, due_date, status } = req.body;

  if (!description || !due_date) {
    return res.status(400).json({ error: 'Description and due_date are required' });
  }

  const validStatuses = ['Pending', 'In Progress', 'Completed'];
  const finalStatus = status && validStatuses.includes(status) ? status : 'Pending';

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO tasks (description, due_date, status) VALUES (?, ?, ?)',
      [description, due_date, finalStatus]
    );
    connection.release();

    res.status(201).json({
      task_id: result.insertId,
      description,
      due_date,
      status: finalStatus,
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task', details: error.message });
  }
});

// PUT update task
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { description, due_date, status } = req.body;

  if (!description || !due_date) {
    return res.status(400).json({ error: 'Description and due_date are required' });
  }

  const validStatuses = ['Pending', 'In Progress', 'Completed'];
  const finalStatus = status && validStatuses.includes(status) ? status : 'Pending';

  try {
    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE tasks SET description = ?, due_date = ?, status = ? WHERE task_id = ?',
      [description, due_date, finalStatus, id]
    );
    connection.release();

    res.json({
      task_id: parseInt(id),
      description,
      due_date,
      status: finalStatus,
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task', details: error.message });
  }
});

// DELETE task
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM tasks WHERE task_id = ?', [id]);
    connection.release();
    res.json({ message: 'Task deleted successfully', task_id: parseInt(id) });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task', details: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
