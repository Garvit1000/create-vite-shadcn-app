# create-shadcn-starter

A CLI tool to quickly scaffold a React application with Vite, Tailwind CSS, and shadcn/ui components. Get started with a fully configured development environment in seconds.

## Features

- 🚀 [Vite](https://vitejs.dev/) for fast development and building
- 🎨 [shadcn/ui](https://ui.shadcn.com/) components pre-configured
- 🌙 Dark mode support out of the box
- 🎯 [Tailwind CSS](https://tailwindcss.com/) for styling
- 📱 Responsive design ready
- 🧭 [React Router](https://reactrouter.com/) for navigation
- 📦 [Zustand](https://zustand-demo.pmnd.rs/) for state management
- ⚡️ Example components and pages included
- 🔧 TypeScript ready

## Quick Start

```bash
# Using npm
npm create shadcn-starter@latest

# Using yarn
yarn create shadcn-starter

# Using pnpm
pnpm create shadcn-starter
```

Or specify a name for your project:

```bash
npm create shadcn-starter@latest my-app
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