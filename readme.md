# Enhanced Vite + React + Tailwind + shadcn/ui 

A CLI tool to quickly scaffold a React application with Vite, Tailwind CSS, and shadcn/ui components. Get started with a fully configured development environment in seconds. New updates included

## Features
- 🚀 [Vite](https://vitejs.dev/) for fast development and building
- 🎨 [shadcn/ui](https://ui.shadcn.com/) components pre-configured with latest versions
- 🌙 Dark mode support out of the box
- 🎯 [Tailwind CSS v4](https://tailwindcss.com/) with advanced features:
  - Container queries support (optional)
  - Typography plugin
  - Enhanced responsive design
- 📱 Modern responsive design with latest Tailwind features
- 🧭 [React Router](https://reactrouter.com/) for navigation
- 📦 [Zustand](https://zustand-demo.pmnd.rs/) for state management
- ⚡️ Example components and pages included
- 🔧 connects to git 
- 📦 Support for npm, yarn, pnpm, and bun package managers

## Quick Start

```bash
# Using npx
npx create-vite-shadcn-app my-app

# select one choice
it will give option to choose from npm, yarn, pnpm, or bun selection as you like
```

Or specify a name for your project:

```bash
npx create-vite-shadcn-app my-app
```
## Development
After creating your project:

```bash
cd my-app

# Start the development server
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun run dev
```
Visit `http://localhost:5173` to see your application.


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