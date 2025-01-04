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

async function init() {
  let projectDir;
  let projectName;
  let packageManager;
  let features;

  try {
    // Set up command line interface
    program
      .name('create-vite-shadcn-app')
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
        ],
      },
      {
        type: 'multiselect',
        name: 'features',
        message: 'Select additional features:',
        choices: [
          { title: 'React Router', value: 'router', selected: true },
          { title: 'Zustand (State Management)', value: 'zustand', selected: true },
          { title: 'Dark Mode', value: 'darkMode', selected: true },
          { title: 'Example Components', value: 'examples', selected: true }
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
        '@radix-ui/react-dialog': '^1.0.4',
        '@radix-ui/react-dropdown-menu': '^2.0.5',
        '@radix-ui/react-label': '^2.0.2',
        '@radix-ui/react-select': '^1.2.2',
        '@radix-ui/react-toast': '^1.1.4',
        'class-variance-authority': '^0.7.0',
        'clsx': '^2.0.0',
        'tailwind-merge': '^2.0.0',
        'tailwindcss-animate': '^1.0.7',
        'lucide-react': '^0.263.1'
      },
      devDependencies: {
        '@types/node': '^20.4.5',
        '@types/react': '^18.2.15',
        '@types/react-dom': '^18.2.7',
        '@vitejs/plugin-react': '^4.0.3',
        'autoprefixer': '^10.4.14',
        'postcss': '^8.4.27',
        'tailwindcss': '^3.3.3',
        'vite': '^4.4.5'
      }
    };

    // Add optional dependencies based on selected features
    if (features.includes('router')) {
      packageJson.dependencies['react-router-dom'] = '^6.15.0';
    }

    if (features.includes('zustand')) {
      packageJson.dependencies['zustand'] = '^4.4.1';
    }

    // Write package.json
    fs.writeFileSync(
      path.join(projectDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Initialize git repository
    try {
      execSync('git init', { cwd: projectDir });
      // Create .gitignore
      fs.writeFileSync(
        path.join(projectDir, '.gitignore'),
        'node_modules\n.DS_Store\ndist\n.env\n*.local'
      );
    } catch (error) {
      spinner.warn('Could not initialize git repository');
    }

    // Install dependencies
    spinner.text = 'Installing dependencies...';
    
    const installCommand = packageManager === 'npm' ? 'npm install' :
                         packageManager === 'pnpm' ? 'pnpm install' :
                         'yarn';
    
    try {
      execSync(installCommand, { cwd: projectDir, stdio: 'inherit' });
    } catch (error) {
      spinner.fail('Failed to install dependencies');
      throw error;
    }

    // Project creation complete
    spinner.succeed(chalk.green('Project created successfully!'));
    
    // Show next steps
    console.log('\nNext steps:');
    if (projectDir !== '.') {
      console.log(chalk.cyan(`  cd ${projectDir}`));
    }
    console.log(chalk.cyan(`  ${packageManager} run dev`));
    console.log('\nHappy coding! 🎉\n');

  } catch (error) {
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
}

init().catch((error) => {
  console.error(error);
  process.exit(1);
});