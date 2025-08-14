# Backend API with PostgreSQL and Prisma

This is the backend API server for your application, built with Express.js, PostgreSQL, and Prisma.

## Quick Start

**IMPORTANT**: All commands below must be run from the `backend` directory!

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL
   ```

4. **Set up the database:**
   ```bash
   npm run db:generate  # Generate Prisma client
   npm run db:migrate   # Run database migrations
   npm run db:seed      # Seed the database (optional)
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3001/api`

## ⚠️ Important Directory Notes

- **Always run Prisma commands from the `backend` directory**
- The Prisma schema is located at `backend/prisma/schema.prisma`
- If you get "Prisma Schema not found" errors, make sure you're in the `backend` directory

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with auto-reload
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:seed` - Seed the database with sample data
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:reset` - Reset the database (⚠️ deletes all data)

## API Endpoints

### Health Check
- `GET /api/health` - Check if the server is running

### Users
- `GET /api/users/:clerkId` - Get user by Clerk ID
- `POST /api/users` - Create or update user
- `GET /api/users/:clerkId/stats` - Get user statistics

### Posts
- `GET /api/posts` - Get all posts (with pagination)
- `GET /api/posts/:id` - Get post by ID
- `GET /api/users/:clerkId/posts` - Get posts by user
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post
- `GET /api/posts/search?q=query` - Search posts

## Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"
PORT=3001
```

## Database Setup

1. **Install PostgreSQL** on your machine or use a cloud service
2. **Create a database** for your application
3. **Update the DATABASE_URL** in your `.env` file
4. **Run migrations** to create the tables: `npm run db:migrate`

## Frontend Integration

To connect your frontend to this backend API, update your frontend code to make requests to `http://localhost:3001/api` instead of trying to use Prisma directly in the browser.

Example frontend API service:

```javascript
// src/lib/api.js
const API_BASE = 'http://localhost:3001/api';

export const api = {
  // Users
  getUser: (clerkId) => fetch(`${API_BASE}/users/${clerkId}`).then(r => r.json()),
  createUser: (userData) => fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  }).then(r => r.json()),

  // Posts
  getPosts: () => fetch(`${API_BASE}/posts`).then(r => r.json()),
  createPost: (postData) => fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData)
  }).then(r => r.json()),
};
```

## Production Deployment

1. Set up your production PostgreSQL database
2. Update the `DATABASE_URL` environment variable
3. Run `npm run db:migrate` on your production server
4. Use `npm start` to run the production server
5. Consider using PM2 or similar process manager for production

## File Structure

```
backend/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.js          # Database seeding script
├── prisma.js            # Prisma client configuration
├── userService.js       # User-related database operations
├── postService.js       # Post-related database operations
├── server.js            # Express server and API routes
├── package.json         # Dependencies and scripts
└── README.md            # This file