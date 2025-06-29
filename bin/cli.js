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

    // Get project details
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

    // Start the creation process
    const spinner = ora('Creating your project...').start();

    // Create project directory
    fs.mkdirSync(projectDir, { recursive: true });

    // Copy template files
    const templateDir = path.join(PACKAGE_ROOT, 'templates/base');
    fs.copySync(templateDir, projectDir);

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
      const targetPath = path.join(projectDir, file);
      
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

    // Write package.json
    fs.writeFileSync(
      path.join(projectDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Initialize git repository and setup husky
    try {
      execSync('git init', { cwd: projectDir });
      
      // Create .gitignore
      fs.writeFileSync(
        path.join(projectDir, '.gitignore'),
        'node_modules\n.DS_Store\ndist\n.env\n*.local\n.husky\n.eslintcache'
      );

      // Create ESLint config
      fs.writeFileSync(
        path.join(projectDir, '.eslintrc.json'),
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
        path.join(projectDir, '.prettierrc'),
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
        fs.mkdirSync(path.join(projectDir, dir), { recursive: true });
      });

      // Add utility functions
      fs.writeFileSync(
        path.join(projectDir, 'src/utils/loadable.js'),
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
        path.join(projectDir, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );

    } catch (error) {
      spinner.warn('Could not initialize git repository and configuration files');
    }

    // Install dependencies
    const installSuccess = await installDependencies(projectDir, packageManager, spinner);
    
    if (installSuccess) {
      spinner.succeed(chalk.green('Project created successfully!'));
      
      // Show next steps
      console.log('\nNext steps:');
      if (projectDir !== '.') {
        console.log(chalk.cyan(`  cd ${projectDir}`));
      }
      console.log(chalk.cyan(`  ${packageManager} run dev`));
      console.log('\nHappy coding! 🎉\n');
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
