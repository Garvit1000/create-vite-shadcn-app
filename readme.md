# create-shadcn-starter

A CLI tool to quickly scaffold a React application with Vite, Tailwind CSS, and shadcn/ui components. Get started with a fully configured development environment in seconds.

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

## What's Included

- Configured project structure
- Pre-built components from shadcn/ui
- Dark mode toggle
- Example pages (Home and Dashboard)
- React Router setup
- State management with Zustand
- Tailwind CSS configuration
- Ready-to-use development environment

## Project Structure

```
my-app/
├── src/
│   ├── components/
│   │   ├── ui/          # shadcn/ui components
│   │   └── ThemeToggle.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── Dashboard.jsx
│   ├── store/
│   │   └── theme.js     # Dark mode state
│   ├── lib/
│   │   └── utils.js     # Utility functions
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── jsconfig.json
├── vite.config.js
├── tailwind.config.js
└── package.json
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

## Available Scripts

- `dev` - Start the development server
- `build` - Build for production
- `preview` - Preview production build
- `lint` - Lint your code

## Customization

### Adding New Components

1. Visit [shadcn/ui](https://ui.shadcn.com/docs/components)
2. Choose a component
3. Follow the installation instructions
4. The component will be added to your `components/ui` directory

### Modifying Theme

Edit the CSS variables in `src/index.css` to customize your theme:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  /* ... other variables */
}

.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  /* ... other variables */
}
```

## Release Notes

### v1.1.1 (Latest)
- Added support for Bun package manager
- Fixed container queries compatibility issue
- Made container queries an optional feature
- Improved error handling for package installation
- Updated dependencies to latest versions

### v1.0.10
- Initial public release
- Support for npm, yarn, and pnpm
- Basic shadcn/ui components setup

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

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
