import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as UserModel from './models/user.model';

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use(cors());
app.use(express.json());

// Create user
app.post('/api/users', async (req, res) => {
  try {
    const userId = await UserModel.createUser(req.body);
    res.status(201).json({ id: userId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
  try {
    await UserModel.updateUser({ ...req.body, id: parseInt(req.params.id) });
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
  try {
    await UserModel.deleteUser(parseInt(req.params.id));
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Search users
app.get('/api/users/search', async (req, res) => {
  try {
    const query = req.query.q as string;
    const users = await UserModel.searchUsers(query);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search users' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});