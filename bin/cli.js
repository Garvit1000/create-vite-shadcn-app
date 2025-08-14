#!/usr/bin/env node
import { program } from 'commander';
import chalk from 'chalk';
import prompts from 'prompts';
import fs from 'fs-extra';
import { execSync } from 'child_process';
import ora from 'ora';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.join(__dirname, '..');

// Helper function to detect package manager
function detectPackageManager() {
  const userAgent = process.env.npm_config_user_agent;
  if (userAgent) {
    if (userAgent.startsWith('yarn')) return 'yarn';
    if (userAgent.startsWith('pnpm')) return 'pnpm';
    if (userAgent.startsWith('bun')) return 'bun';
  }
  return 'npm';
}

// Helper function to install dependencies
async function installDependencies(projectDir, packageManager, spinner) {
  try {
    // Define commands for different package managers
    const commands = {
      npm: {
        install: 'npm install',
        installDev: 'npm install -D',
        run: 'npm run'
      },
      pnpm: {
        install: 'pnpm install',
        installDev: 'pnpm install -D',
        run: 'pnpm'
      },
      yarn: {
        install: 'yarn',
        installDev: 'yarn add -D',
        run: 'yarn'
      },
      bun: {
        install: 'bun install',
        installDev: 'bun add -d',
        run: 'bun run'
      }
    };

    // Check if the selected package manager is installed
    try {
      if (packageManager === 'bun') {
        // Special handling for Bun
        try {
          execSync('bun --version', { stdio: 'ignore' });
        } catch (error) {
          spinner.warn('Bun is not detected. Attempting to install Bun...');
          try {
            // Try to install Bun if not present
            execSync('npm install -g bun', { stdio: 'inherit' });
            spinner.succeed('Bun installed successfully!');
          } catch (bunInstallError) {
            spinner.fail('Failed to install Bun. Please install it manually: https://bun.sh/docs/installation');
            process.exit(1);
          }
        }
      } else {
        execSync(`${packageManager} --version`, { stdio: 'ignore' });
      }
    } catch (error) {
      spinner.fail(`${packageManager} is not installed. Please install it first.`);
      process.exit(1);
    }

    // Install dependencies
    spinner.text = 'Installing dependencies...';
    execSync(commands[packageManager].install, {
      cwd: projectDir,
      stdio: 'inherit'
    });

    return true;
  } catch (error) {
    spinner.fail('Failed to install dependencies');
    console.error(error);
    return false;
  }
}

async function init() {
  let projectDir;
  let projectName;
  let packageManager;
  let features;

  try {
    // Set up command line interface
    program
      .name('create-shadcn-starter')
      .description('Scaffold a new Vite + Tailwind + shadcn/ui application')
      .argument('[dir]', 'Directory to create the project in')
      .parse(process.argv);

    projectDir = program.args[0];

    // If no directory is provided, ask for project details in current directory
    if (!projectDir) {
      const response = await prompts({
        type: 'text',
        name: 'dir',
        message: 'Where would you like to create your project?',
        initial: '.'
      });
      projectDir = response.dir;
    }

    // Resolve the full path
    projectDir = path.resolve(projectDir);

    // Check if directory is empty
    if (fs.existsSync(projectDir) && fs.readdirSync(projectDir).length > 0) {
      const force = await prompts({
        type: 'confirm',
        name: 'value',
        message: 'Directory not empty. Continue anyway?',
        initial: false
      });
      if (!force.value) {
        process.exit(1);
      }
    }

    // Get project details with enhanced options
    const response = await prompts([
      {
        type: 'text',
        name: 'projectName',
        message: 'What is your project named?',
        initial: path.basename(projectDir),
        validate: name => name.match(/^[a-z0-9-_]+$/i) ? true : 'Project name may only include letters, numbers, underscores, and hashes'
      },
      {
        type: 'select',
        name: 'packageManager',
        message: 'Which package manager do you want to use?',
        choices: [
          { title: 'npm', value: 'npm' },
          { title: 'pnpm', value: 'pnpm' },
          { title: 'yarn', value: 'yarn' },
          { title: 'bun', value: 'bun' },
        ],
        initial: detectPackageManager() === 'npm' ? 0 :
                 detectPackageManager() === 'pnpm' ? 1 :
                 detectPackageManager() === 'yarn' ? 2 :
                 detectPackageManager() === 'bun' ? 3 : 0
      },
      {
        type: 'select',
        name: 'auth',
        message: 'Choose authentication provider:',
        choices: [
          { title: 'None', value: 'none' },
          { title: 'Clerk (Recommended)', value: 'clerk' }
        ],
        initial: 1
      },
      {
        type: 'select',
        name: 'database',
        message: 'Choose database setup:',
        choices: [
          { title: 'None', value: 'none' },
          { title: 'PostgreSQL + Prisma (Recommended)', value: 'postgres-prisma' }
        ],
        initial: 1
      },
      {
        type: 'multiselect',
        name: 'features',
        message: 'Select additional features:',
        choices: [
          { title: 'React Router', value: 'router', selected: true },
          { title: 'Zustand (State Management)', value: 'zustand', selected: true },
          { title: 'Dark Mode', value: 'darkMode', selected: true },
          { title: 'Example Components', value: 'examples', selected: true },
          { title: 'Container Queries', value: 'containerQueries', selected: false },
          { title: 'ESLint & Prettier', value: 'linting', selected: true },
          { title: 'Code Splitting & Lazy Loading', value: 'codeSplitting', selected: true },
          { title: 'PWA Support', value: 'pwa', selected: false },
          { title: 'Image Optimization', value: 'imageOptimization', selected: true }
        ],
      }
    ]);

    projectName = response.projectName;
    packageManager = response.packageManager;
    features = response.features;
    const auth = response.auth;
    const database = response.database;

    console.log(chalk.cyan('\n🚀 Creating your project with:'));
    console.log(chalk.gray(`   • Package Manager: ${packageManager}`));
    if (auth !== 'none') console.log(chalk.gray(`   • Authentication: ${auth}`));
    if (database !== 'none') console.log(chalk.gray(`   • Database: ${database}`));
    console.log(chalk.gray(`   • Features: ${features.join(', ')}`));
    console.log('');

    // Start the creation process
    const spinner = ora('Creating your project...').start();

    // Create project directory
    fs.mkdirSync(projectDir, { recursive: true });

    // Determine project structure based on database selection
    let frontendDir = projectDir;
    if (database === 'postgres-prisma') {
      // For PostgreSQL projects, create frontend and backend folders
      frontendDir = path.join(projectDir, 'frontend');
      fs.mkdirSync(frontendDir, { recursive: true });
    }

    // Copy base template to appropriate directory
    const templateDir = path.join(PACKAGE_ROOT, 'templates/base');
    fs.copySync(templateDir, frontendDir);
    
    // Determine which App.jsx to use based on selections
    let appTemplate = 'base';
    if (auth === 'clerk' && database === 'postgres-prisma') {
      appTemplate = 'clerk-postgres';
    } else if (auth === 'clerk') {
      appTemplate = 'clerk';
    }
    
    // Copy auth-specific files from src directory
    if (auth === 'clerk') {
      const authSrcDir = path.join(PACKAGE_ROOT, 'templates/auth/clerk/src');
      const projectSrcDir = path.join(frontendDir, 'src');
      
      if (fs.existsSync(authSrcDir)) {
        // Copy all auth src files except App.jsx (we'll handle it separately)
        fs.copySync(authSrcDir, projectSrcDir, {
          overwrite: true,
          filter: (src, dest) => {
            // Skip App.jsx file to avoid conflicts - we'll copy it explicitly later
            return !src.endsWith('App.jsx');
          }
        });
        
        // Copy .env.example from auth template root
        const authEnvPath = path.join(PACKAGE_ROOT, 'templates/auth/clerk/.env.example');
        const projectEnvPath = path.join(frontendDir, '.env.example');
        if (fs.existsSync(authEnvPath)) {
          fs.copyFileSync(authEnvPath, projectEnvPath);
        }
        
        spinner.text = 'Adding Clerk authentication components...';
      }
    }
    
    // Copy database-specific files
    if (database === 'postgres-prisma') {
      const dbTemplateDir = path.join(PACKAGE_ROOT, 'templates/database/postgres-prisma');
      
      // Copy backend directory
      const backendSrcDir = path.join(dbTemplateDir, 'backend');
      const projectBackendDir = path.join(projectDir, 'backend');
      if (fs.existsSync(backendSrcDir)) {
        fs.copySync(backendSrcDir, projectBackendDir, { overwrite: true });
      }
      
      // Copy frontend API service
      const frontendApiDir = path.join(dbTemplateDir, 'src');
      const projectSrcDir = path.join(frontendDir, 'src');
      if (fs.existsSync(frontendApiDir)) {
        fs.copySync(frontendApiDir, projectSrcDir, { overwrite: true });
      }
      
      // Copy frontend .env.example
      const frontendEnvPath = path.join(dbTemplateDir, 'frontend.env.example');
      const projectEnvPath = path.join(frontendDir, '.env.example');
      if (fs.existsSync(frontendEnvPath)) {
        // Merge with existing .env.example if it exists
        if (fs.existsSync(projectEnvPath)) {
          const existingEnv = fs.readFileSync(projectEnvPath, 'utf8');
          const frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');
          fs.writeFileSync(projectEnvPath, existingEnv + '\n\n' + frontendEnv);
        } else {
          fs.copyFileSync(frontendEnvPath, projectEnvPath);
        }
      }
      
      // Copy setup guide
      const setupGuidePath = path.join(dbTemplateDir, 'SETUP_GUIDE.md');
      const projectSetupGuidePath = path.join(projectDir, 'SETUP_GUIDE.md');
      if (fs.existsSync(setupGuidePath)) {
        fs.copyFileSync(setupGuidePath, projectSetupGuidePath);
      }
      
      // Create root README.md for PostgreSQL projects
      const rootReadmeContent = `# ${projectName}

This is a full-stack application with separate frontend and backend.

## Project Structure

\`\`\`
${projectName}/
├── frontend/          # React + Vite + Tailwind + shadcn/ui
│   ├── src/
│   ├── package.json
│   └── .env.example
├── backend/           # Express + Prisma + PostgreSQL
│   ├── server.js
│   ├── prisma/
│   ├── package.json
│   └── .env.example
└── README.md         # This file
\`\`\`

## Quick Start

### 1. Backend Setup
\`\`\`bash
cd backend
npm install
cp .env.example .env
# Update DATABASE_URL in .env with your PostgreSQL connection
npm install
npm run db:generate
npm run db:migrate
npm run dev  # Starts on port 3001
\`\`\`

### 2. Frontend Setup (New Terminal)
\`\`\`bash
cd frontend
npm install
cp .env.example .env.local
# Add your environment variables (Clerk keys, etc.)
npm run dev  # Starts on port 5173
\`\`\`

## Important Notes

- **Both servers must be running** for the application to work
- Backend runs on http://localhost:3001
- Frontend runs on http://localhost:5173
- Frontend communicates with backend via API calls

## Documentation

- See \`SETUP_GUIDE.md\` for detailed setup instructions
- Backend API documentation is in \`backend/README.md\`
`;
      
      fs.writeFileSync(path.join(projectDir, 'README.md'), rootReadmeContent);
      
      spinner.text = 'Adding PostgreSQL backend and API integration...';
    }
    
    // Copy integration-specific files from src directory (if both auth and database are selected)
    if (auth === 'clerk' && database === 'postgres-prisma') {
      const integrationSrcDir = path.join(PACKAGE_ROOT, 'templates/integrations/clerk-postgres/src');
      const projectSrcDir = path.join(frontendDir, 'src');
      
      if (fs.existsSync(integrationSrcDir)) {
        fs.copySync(integrationSrcDir, projectSrcDir, { overwrite: true });
        
        // Merge integration .env.example
        const integrationEnvPath = path.join(PACKAGE_ROOT, 'templates/integrations/clerk-postgres/.env.example');
        const projectEnvPath = path.join(frontendDir, '.env.example');
        if (fs.existsSync(integrationEnvPath)) {
          const existingEnv = fs.readFileSync(projectEnvPath, 'utf8');
          const integrationEnv = fs.readFileSync(integrationEnvPath, 'utf8');
          fs.writeFileSync(projectEnvPath, existingEnv + '\n' + integrationEnv);
        }
        
        spinner.text = 'Adding Clerk + PostgreSQL integration...';
      }
    }
    
    // Copy the correct App.jsx based on selections
    if (appTemplate === 'clerk-postgres') {
      // Use integration App.jsx if available, otherwise auth App.jsx
      const integrationAppPath = path.join(PACKAGE_ROOT, 'templates/integrations/clerk-postgres/src/App.jsx');
      const authAppPath = path.join(PACKAGE_ROOT, 'templates/auth/clerk/src/App.jsx');
      const targetAppPath = path.join(frontendDir, 'src/App.jsx');
      
      if (fs.existsSync(integrationAppPath)) {
        fs.copyFileSync(integrationAppPath, targetAppPath);
      } else if (fs.existsSync(authAppPath)) {
        fs.copyFileSync(authAppPath, targetAppPath);
      }
    } else if (appTemplate === 'clerk') {
      // Use auth App.jsx
      const authAppPath = path.join(PACKAGE_ROOT, 'templates/auth/clerk/src/App.jsx');
      const targetAppPath = path.join(frontendDir, 'src/App.jsx');
      
      if (fs.existsSync(authAppPath)) {
        fs.copyFileSync(authAppPath, targetAppPath);
      }
    }
    // If appTemplate === 'base', keep the base App.jsx (already copied)

    // Ensure all necessary config files exist
    const configFiles = [
      'postcss.config.js',
      'tailwind.config.js',
      'vite.config.js',
      'index.html',
      'jsconfig.json',
    ];

    configFiles.forEach(file => {
      const sourcePath = path.join(templateDir, file);
      const targetPath = path.join(frontendDir, file);
      
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, targetPath);
      } else {
        spinner.warn(`Warning: Could not find ${file} in template`);
      }
    });

    // Create package.json
    const packageJson = {
      name: projectName,
      private: true,
      version: '0.0.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'vite build',
        lint: 'eslint src --ext js,jsx --report-unused-disable-directives --max-warnings 0',
        preview: 'vite preview'
      },
      dependencies: {
        'react': '^18.2.0',
        'react-dom': '^18.2.0',
        '@radix-ui/react-slot': '^1.0.2',
        '@radix-ui/react-dialog': '^1.0.5',
        '@radix-ui/react-dropdown-menu': '^2.0.6',
        '@radix-ui/react-navigation-menu': '^1.2.3',
        '@radix-ui/react-label': '^2.0.2',
        '@radix-ui/react-select': '^2.0.0',
        '@radix-ui/react-toast': '^1.1.5',
        'class-variance-authority': '^0.7.0',
        'clsx': '^2.1.0',
        'tailwind-merge': '^2.2.1',
        'tailwindcss-animate': '^1.0.7',
        'lucide-react': '^0.330.0'
      },
      devDependencies: {
        '@types/node': '^20.11.19',
        '@types/react': '^18.2.56',
        '@types/react-dom': '^18.2.19',
        '@vitejs/plugin-react': '^4.2.1',
        'autoprefixer': '^10.4.17',
        'postcss': '^8.4.35',
        'tailwindcss': '^3.4.1',
        '@tailwindcss/typography': '^0.5.10',
        'vite': '^5.1.3',
        'eslint': '^8.56.0',
        'eslint-plugin-react': '^7.33.2',
        'eslint-plugin-react-hooks': '^4.6.0',
        'eslint-plugin-import': '^2.29.1',
        'eslint-config-prettier': '^9.1.0',
        'prettier': '^3.2.5',
        'husky': '^9.0.11',
        'lint-staged': '^15.2.2',
        'sharp': '^0.33.2',
        'vite-plugin-pwa': '^0.17.4',
        '@rollup/plugin-dynamic-import-vars': '^2.1.2'
      }
    };

    // Add optional dependencies based on selected features
    if (features.includes('router')) {
      packageJson.dependencies['react-router-dom'] = '^6.22.0';
    }

    if (features.includes('zustand')) {
      packageJson.dependencies['zustand'] = '^4.5.0';
    }

    // Add authentication dependencies
    if (auth === 'clerk') {
      packageJson.dependencies['@clerk/clerk-react'] = '^4.29.1';
      packageJson.dependencies['@clerk/themes'] = '^1.7.9';
    }

    // Add database dependencies (only @prisma/client for frontend)
    if (database === 'postgres-prisma') {
      packageJson.dependencies['@prisma/client'] = '^5.7.1';
      // Prisma CLI is handled in backend package.json
    }

    // Add container queries if selected
    if (features.includes('containerQueries')) {
      packageJson.devDependencies['@tailwindcss/container-queries'] = '^0.1.1';
      
      // Update tailwind config to include container queries
      const tailwindConfigPath = path.join(projectDir, 'tailwind.config.js');
      if (fs.existsSync(tailwindConfigPath)) {
        let tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf8');
        // Add container queries to plugins if not already there
        if (!tailwindConfig.includes('@tailwindcss/container-queries')) {
          tailwindConfig = tailwindConfig.replace(
            'plugins: [',
            'plugins: [\n      require("@tailwindcss/container-queries"),'
          );
          fs.writeFileSync(tailwindConfigPath, tailwindConfig);
        }
      }
    }

    // Write package.json to appropriate directory
    fs.writeFileSync(
      path.join(frontendDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Generate environment file
    let envContent = '';
    
    if (auth === 'clerk') {
      envContent += `# Clerk Configuration
# Get these values from your Clerk Dashboard (https://dashboard.clerk.dev/)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your-publishable-key-here
CLERK_SECRET_KEY=sk_test_your-secret-key-here

# Clerk URLs (Optional - these are the defaults)
VITE_CLERK_SIGN_IN_URL=/sign-in
VITE_CLERK_SIGN_UP_URL=/sign-up
VITE_CLERK_AFTER_SIGN_IN_URL=/dashboard
VITE_CLERK_AFTER_SIGN_UP_URL=/dashboard

`;
    }
    
    if (database === 'postgres-prisma') {
      envContent += `# Database Configuration
# PostgreSQL connection string
# Format: postgresql://username:password@localhost:5432/database_name
DATABASE_URL="postgresql://postgres:password@localhost:5432/myapp_db"

# Optional: Direct URL for migrations (same as DATABASE_URL for local development)
DIRECT_URL="postgresql://postgres:password@localhost:5432/myapp_db"

# Database Settings
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp_db
DB_USER=postgres
DB_PASSWORD=password

`;
    }
    
    envContent += `# Application Settings
VITE_APP_NAME=${projectName}
VITE_APP_URL=http://localhost:5173
NODE_ENV=development
PORT=5173
`;

    fs.writeFileSync(path.join(frontendDir, '.env.example'), envContent);

    // Initialize git repository and setup husky
    try {
      execSync('git init', { cwd: projectDir });
      
      // Create .gitignore in project root
      const gitignoreContent = database === 'postgres-prisma'
        ? 'node_modules\n.DS_Store\ndist\n.env\n.env.local\n*.local\n.husky\n.eslintcache\nfrontend/node_modules\nbackend/node_modules\nfrontend/dist\nbackend/dist'
        : 'node_modules\n.DS_Store\ndist\n.env\n.env.local\n*.local\n.husky\n.eslintcache';
      
      fs.writeFileSync(
        path.join(projectDir, '.gitignore'),
        gitignoreContent
      );

      // Create ESLint config
      fs.writeFileSync(
        path.join(frontendDir, '.eslintrc.json'),
        JSON.stringify({
          "extends": [
            "eslint:recommended",
            "plugin:react/recommended",
            "plugin:react-hooks/recommended",
            "prettier"
          ],
          "plugins": ["react", "import"],
          "parserOptions": {
            "ecmaVersion": 2022,
            "sourceType": "module",
            "ecmaFeatures": {
              "jsx": true
            }
          },
          "settings": {
            "react": {
              "version": "detect"
            }
          },
          "rules": {
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off"
          }
        }, null, 2)
      );

      // Create Prettier config
      fs.writeFileSync(
        path.join(frontendDir, '.prettierrc'),
        JSON.stringify({
          "semi": true,
          "singleQuote": true,
          "tabWidth": 2,
          "trailingComma": "es5"
        }, null, 2)
      );

      // Create enhanced folder structure
      const directories = [
        'src/assets',
        'src/components/common',
        'src/components/layout',
        'src/hooks',
        'src/utils',
        'src/services',
        'src/constants',
        'src/types'
      ];

      directories.forEach(dir => {
        fs.mkdirSync(path.join(frontendDir, dir), { recursive: true });
      });

      // Add utility functions
      fs.writeFileSync(
        path.join(frontendDir, 'src/utils/loadable.js'),
        `import { lazy, Suspense } from 'react';

export const loadable = (importFunc) => {
  const LazyComponent = lazy(importFunc);
  return (props) => (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent {...props} />
    </Suspense>
  );
};`
      );

      // Update package.json scripts
      packageJson.scripts = {
        ...packageJson.scripts,
        "lint": "eslint . --ext .js,.jsx --fix",
        "format": "prettier --write .",
        "prepare": "husky"
      };

      // Add lint-staged configuration
      packageJson["lint-staged"] = {
        "*.{js,jsx}": [
          "eslint --fix",
          "prettier --write"
        ],
        "*.{json,md}": [
          "prettier --write"
        ]
      };

      // Write updated package.json
      fs.writeFileSync(
        path.join(frontendDir, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );

    } catch (error) {
      spinner.warn('Could not initialize git repository and configuration files');
    }

    // Install dependencies with database setup
    const installSuccess = await installDependencies(frontendDir, packageManager, spinner);
    
    // Run post-install scripts for database
    if (installSuccess && database === 'postgres-prisma') {
      spinner.text = 'Setting up backend dependencies...';
      try {
        // Install backend dependencies
        const backendDir = path.join(projectDir, 'backend');
        execSync('npm install', { cwd: backendDir, stdio: 'inherit' });
        spinner.succeed('Backend dependencies installed successfully!');
      } catch (error) {
        spinner.warn('Backend setup incomplete. Run "cd backend && npm install" manually.');
      }
    }
    
    if (installSuccess) {
      spinner.succeed(chalk.green('✨ Project created successfully!'));
      
      // Show enhanced next steps
      console.log('\n' + chalk.cyan('📋 Next steps:'));
      if (projectDir !== '.') {
        console.log(`   ${chalk.gray('1.')} cd ${projectName}`);
      }
      
      // Show environment setup if needed
      if (database === 'postgres-prisma') {
        console.log(`   ${chalk.gray('2.')} ${chalk.bold('Backend Setup (Required):')} cd backend`);
        console.log(`      ${chalk.yellow('•')} Copy .env.example to .env`);
        console.log(`      ${chalk.yellow('•')} Update DATABASE_URL with your PostgreSQL connection`);
        console.log(`      ${chalk.yellow('•')} Run: npm install`);
        console.log(`      ${chalk.yellow('•')} Run: npm run db:setup (generates client + creates migration)`);
        console.log(`      ${chalk.yellow('•')} Run: npm run dev (starts backend on port 3001)`);
        console.log(`   ${chalk.gray('3.')} ${chalk.bold('Frontend Setup (New Terminal):')} cd frontend`);
        if (auth === 'clerk') {
          console.log(`      ${chalk.yellow('•')} Copy .env.example to .env.local`);
          console.log(`      ${chalk.yellow('•')} Add your Clerk keys from https://dashboard.clerk.dev/`);
        }
        console.log(`      ${chalk.yellow('•')} Run: ${packageManager} run dev (starts frontend on port 5173)`);
        console.log(`\n   ${chalk.red('⚠️  IMPORTANT:')} Both backend and frontend must be running!`);
        console.log(`   ${chalk.blue('🪟 Windows users:')} If commands hang, use direct paths:`);
        console.log(`      ${chalk.gray('• .\\node_modules\\.bin\\prisma.cmd generate')}`);
        console.log(`      ${chalk.gray('• .\\node_modules\\.bin\\prisma.cmd migrate dev --name init')}`);
        console.log(`   ${chalk.blue('📖 Read SETUP_GUIDE.md for detailed instructions')}`);
      } else {
        if (auth === 'clerk') {
          console.log(`   ${chalk.gray('2.')} Copy .env.example to .env.local and configure:`);
          console.log(`      ${chalk.yellow('•')} Add your Clerk keys from https://dashboard.clerk.dev/`);
        }
        console.log(`   ${chalk.gray('3.')} ${packageManager} run dev`);
      }
      console.log('\n' + chalk.green('🎉 Happy coding!'));
      
      // Show helpful links
      if (auth === 'clerk' || database === 'postgres-prisma') {
        console.log('\n' + chalk.cyan('📚 Helpful links:'));
        if (auth === 'clerk') {
          console.log(`   ${chalk.blue('•')} Clerk Dashboard: https://dashboard.clerk.dev/`);
          console.log(`   ${chalk.blue('•')} Clerk Docs: https://clerk.dev/docs`);
        }
        if (database === 'postgres-prisma') {
          console.log(`   ${chalk.blue('•')} Prisma Docs: https://prisma.io/docs`);
          console.log(`   ${chalk.blue('•')} PostgreSQL Setup: https://postgresql.org/download/`);
        }
      }
    }

  } catch (error) {
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
}

init().catch((error) => {
  console.error(error);
  process.exit(1);
});
