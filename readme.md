# Vite + React + Tailwind + shadcn/ui + Auth + Database

A **zero-config CLI tool** to scaffold full-stack React applications with authentication and database integration. Build production-ready apps in seconds with **Clerk authentication** and **PostgreSQL database** support built-in. adding more providers soon 

## 🚀 What's New in v2.0

### ⚡ Zero-Config Full-Stack Setup
- **🔐 Clerk Authentication** - Complete auth system with sign-in/sign-up pages, user management, and protected routes
- **💾 PostgreSQL + Prisma** - Database integration with user models, CRUD operations, and automatic syncing
- **🔄 Seamless Integration** - Auth and database work together out of the box
- **📄 Auto Environment Setup** - Generates .env.example with all required variables
- **🛠️ Database Scripts** - Pre-configured commands for migrations, seeding, and management

### 🎯 One Command, Full App
```bash
npx create-vite-shadcn-app my-app
# Choose Clerk + PostgreSQL
# Get a working full-stack app with authentication and database!
```

---

A CLI tool to quickly scaffold a React application with Vite, Tailwind CSS, shadcn/ui components, authentication, and database. Get started with a fully configured development environment in seconds.

## Features

### 🔐 Authentication (Optional)
- **[Clerk](https://clerk.dev/)** integration with zero configuration
- Pre-built sign-in/sign-up pages with shadcn/ui styling
- User profile management and protected routes
- Automatic theme integration (dark/light mode support)

### 💾 Database (Optional)
- **PostgreSQL + [Prisma](https://prisma.io/)** setup with zero configuration
- User models automatically synced with Clerk authentication
- Complete CRUD operations and database utilities
- Sample data seeding and migration scripts

### 🎨 UI & Styling
- 🚀 [Vite](https://vitejs.dev/) for fast development and building
- 🎨 [shadcn/ui](https://ui.shadcn.com/) components pre-configured with latest versions
- 🌙 Dark mode support out of the box
- 🎯 [Tailwind CSS v3](https://tailwindcss.com/) with advanced features:
  - Container queries support (optional)
  - Typography plugin
  - Enhanced responsive design
- 📱 Modern responsive design with latest Tailwind features

### ⚙️ Development Tools
- 🧭 [React Router](https://reactrouter.com/) for navigation
- 📦 [Zustand](https://zustand-demo.pmnd.rs/) for state management
- ⚡️ Example components and pages included
- 🔧 Git integration
- 📦 Support for npm, yarn, pnpm, and bun package managers

## Quick Start

### Basic Setup
```bash
npx create-vite-shadcn-app my-app
```

### Interactive Options
The CLI will prompt you to choose:

1. **Package Manager**: npm, yarn, pnpm, or bun
2. **Authentication**: None or Clerk (recommended)
3. **Database**: None or PostgreSQL + Prisma (recommended)
4. **Additional Features**: Router, state management, dark mode, etc.

### Zero-Config Full-Stack App
```bash
npx create-vite-shadcn-app my-full-stack-app
# ✅ Choose "Clerk" for authentication
# ✅ Choose "PostgreSQL + Prisma" for database
# 🎉 Get a complete full-stack app!

cd my-full-stack-app
cp .env.example .env.local
# Add your Clerk API keys and database URL
npm run db:migrate
npm run dev
```
## Setup Instructions

### 1. Basic Project
```bash
cd my-app
npm run dev
```
Visit `http://localhost:5173` to see your application.

### 2. With Authentication (Clerk)
```bash
cd my-app

# Configure environment variables
cp .env.example .env.local
# Add your Clerk keys from https://dashboard.clerk.dev/

npm run dev
```

### 3. With Database (PostgreSQL + Prisma)
```bash
cd my-app

# Configure database
cp .env.example .env.local
# Update DATABASE_URL with your PostgreSQL connection

# Set up database
npm run db:migrate
npm run db:seed  # Optional: add sample data

npm run dev
```

### 4. Full-Stack (Clerk + PostgreSQL)
```bash
cd my-app

# Configure both auth and database
cp .env.example .env.local
# Add Clerk keys AND database URL

# Set up database
npm run db:migrate
npm run db:seed  # Optional

npm run dev
```

**🎉 Your full-stack app with authentication and database is ready!**


## Project Structure

```
src/
├── assets/         # Static assets (images, fonts, etc.)
├── components/     # React components
│   ├── common/     # Reusable components
│   ├── layout/     # Layout components
│   └── ui/         # shadcn/ui components
├── hooks/          # Custom React hooks
├── pages/          # Page components
├── services/       # API services and external integrations
├── store/          # State management (Zustand)
├── utils/          # Utility functions
├── constants/      # Constants and configuration
└── types/          # TypeScript types/interfaces
```

## Performance Optimizations

### Code Splitting & Lazy Loading
- Components are lazy loaded using `React.lazy()` and `Suspense`
- Use the `loadable` utility for easy component lazy loading:
```jsx
const MyComponent = loadable(() => import('./MyComponent'));
```

### Image Optimization
- Use the `OptimizedImage` component for automatic image optimization:
```jsx
import OptimizedImage from '@/components/common/OptimizedImage';

<OptimizedImage 
  src="example.jpg"
  alt="Example"
  width={800}
  height={600}
/>
```

### PWA Support
- Progressive Web App (PWA) ready
- Offline support and caching
- Customizable manifest.json

## Development Tools

### ESLint & Prettier
- ESLint configured with React best practices
- Prettier for consistent code formatting
- Pre-commit hooks using husky

### Available Scripts

#### Basic Scripts
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Format code
npm run format

# Lint code
npm run lint
```

#### Database Scripts (When PostgreSQL is selected)
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio

# Reset database (caution: deletes all data)
npm run db:reset
```

### Performance Utilities

The project includes several performance optimization utilities:

1. `debounce`: Limit function call frequency
2. `memoize`: Cache expensive computations
3. `chunkArray`: Split arrays for pagination
4. `createIntersectionObserver`: Lazy loading utility

## Best Practices

1. Use the provided folder structure to maintain code organization
2. Implement lazy loading for route components and large features
3. Optimize images using the OptimizedImage component
4. Use performance utilities for expensive operations
5. Follow ESLint and Prettier guidelines
6. Write meaningful commit messages

## Contributing

Feel free to open issues and pull requests for improvements!

## Acknowledgments

- [Vite](https://vitejs.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Bun](https://bun.sh/)

## Bun Compatibility

This starter template is fully compatible with [Bun](https://bun.sh/), a fast JavaScript runtime and package manager. When using Bun:

- Installation is faster due to Bun's optimized package resolution
- Development server starts up quicker
- Build times are reduced

To use Bun with this template, select "bun" as your package manager during setup. If Bun is not installed, the CLI will attempt to install it for you.

### Bun-specific Commands

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## License

MIT
