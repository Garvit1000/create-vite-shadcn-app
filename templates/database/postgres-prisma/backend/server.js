import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './prisma.js';
import { UserService } from './userService.js';
import { PostService } from './postService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// User routes
app.get('/api/users/:clerkId', async (req, res) => {
  try {
    const user = await UserService.getUserByClerkId(req.params.clerkId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const user = await UserService.upsertUser(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:clerkId/stats', async (req, res) => {
  try {
    const stats = await UserService.getUserStats(req.params.clerkId);
    if (!stats) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Post routes
app.get('/api/posts', async (req, res) => {
  try {
    const { published = 'true', skip = '0', take = '10' } = req.query;
    const posts = await PostService.getAllPosts(
      published === 'true',
      parseInt(skip),
      parseInt(take)
    );
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await PostService.getPostById(parseInt(req.params.id));
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:clerkId/posts', async (req, res) => {
  try {
    const { includeUnpublished = 'false' } = req.query;
    const posts = await PostService.getPostsByUser(
      req.params.clerkId,
      includeUnpublished === 'true'
    );
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const { authorClerkId, ...postData } = req.body;
    const post = await PostService.createPost(authorClerkId, postData);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/posts/:id', async (req, res) => {
  try {
    const { authorClerkId, ...updateData } = req.body;
    const post = await PostService.updatePost(
      parseInt(req.params.id),
      authorClerkId,
      updateData
    );
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    const { authorClerkId } = req.body;
    await PostService.deletePost(parseInt(req.params.id), authorClerkId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/posts/search', async (req, res) => {
  try {
    const { q, published = 'true' } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }
    const posts = await PostService.searchPosts(q, published === 'true');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});