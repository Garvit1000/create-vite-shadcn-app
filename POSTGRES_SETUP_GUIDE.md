# PostgreSQL Local Setup Guide

## 🐘 PostgreSQL Installation for Windows

### Method 1: Official PostgreSQL Installer (Recommended)

#### 1. Download PostgreSQL
- Go to [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
- Click "Download the installer"
- Download the latest version (15.x or 16.x)

#### 2. Install PostgreSQL
```bash
# Run the downloaded installer
# During installation:
- Choose installation directory (default is fine)
- Select components: PostgreSQL Server, pgAdmin 4, Command Line Tools
- Set data directory (default is fine)
- Set password for 'postgres' user (REMEMBER THIS!)
- Set port: 5432 (default)
- Set locale: Default locale
```

#### 3. Verify Installation
```bash
# Open Command Prompt and test
psql --version
# Should show: psql (PostgreSQL) 15.x

# Test connection
psql -U postgres
# Enter the password you set during installation
```

### Method 2: Using Chocolatey (If you have Chocolatey)
```bash
# Install PostgreSQL
choco install postgresql

# Start PostgreSQL service
net start postgresql-x64-15
```

### Method 3: Using Docker (Alternative)
```bash
# Pull PostgreSQL image
docker pull postgres:15

# Run PostgreSQL container
docker run --name postgres-local -e POSTGRES_PASSWORD=mypassword -p 5432:5432 -d postgres:15

# Connect to container
docker exec -it postgres-local psql -U postgres
```

## 🚀 Quick Setup for Testing

### 1. Create a Test Database
```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create a database for testing
CREATE DATABASE myapp_test;

-- Create a user (optional)
CREATE USER myapp_user WITH PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE myapp_test TO myapp_user;

-- Exit
\q
```

### 2. Get Your Connection String
```bash
# Basic connection string format:
postgresql://username:password@localhost:5432/database_name

# Examples:
# Using postgres user:
postgresql://postgres:yourpassword@localhost:5432/myapp_test

# Using custom user:
postgresql://myapp_user:mypassword@localhost:5432/myapp_test
```

### 3. Test Connection with Node.js
```bash
# Install pg (PostgreSQL client)
npm install pg

# Test connection
node -e "
const { Client } = require('pg');
const client = new Client('postgresql://postgres:yourpassword@localhost:5432/myapp_test');
client.connect()
  .then(() => { console.log('✅ Connected to PostgreSQL!'); client.end(); })
  .catch(err => console.log('❌ Connection failed:', err.message));
"
```

## 🔧 Configuration for Your CLI App

### 1. Environment Variables
```bash
# In your .env.local file:
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/myapp_test"
DIRECT_URL="postgresql://postgres:yourpassword@localhost:5432/myapp_test"
```

### 2. Test with Prisma
```bash
# After creating your app with the CLI
create-vite-shadcn-app test-db
cd test-db

# Copy environment file
cp .env.example .env.local

# Edit .env.local and update DATABASE_URL
# DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/myapp_test"

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed

# Start app
npm run dev
```

## 🛠️ Useful PostgreSQL Commands

### Database Management
```sql
-- List all databases
\l

-- Connect to a database
\c database_name

-- List all tables
\dt

-- Describe a table
\d table_name

-- Show all users
\du

-- Quit
\q
```

### Create/Drop Database
```sql
-- Create database
CREATE DATABASE myapp_dev;

-- Drop database (be careful!)
DROP DATABASE myapp_test;

-- Create user
CREATE USER developer WITH PASSWORD 'devpass';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE myapp_dev TO developer;
```

## 🐳 Docker Alternative (Easier Setup)

If you prefer Docker over local installation:

### 1. Create docker-compose.yml
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    container_name: postgres-dev
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: mypassword
      POSTGRES_DB: myapp_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 2. Start PostgreSQL
```bash
# Start PostgreSQL
docker-compose up -d

# Check if running
docker-compose ps

# Connect to database
docker-compose exec postgres psql -U postgres -d myapp_db

# Stop when done
docker-compose down
```

### 3. Connection String for Docker
```bash
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/myapp_db"
```

## 🏃‍♂️ Quick Start for Testing Your CLI

### Option A: Local PostgreSQL
```bash
# 1. Install PostgreSQL (Method 1 above)
# 2. Create test database
psql -U postgres -c "CREATE DATABASE cli_test;"

# 3. Test your CLI
create-vite-shadcn-app my-test-app
cd my-test-app
cp .env.example .env.local

# 4. Edit .env.local:
# DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/cli_test"

# 5. Run migrations
npm run db:migrate
npm run db:seed
npm run dev
```

### Option B: Docker PostgreSQL
```bash
# 1. Start Docker PostgreSQL
docker run --name test-postgres -e POSTGRES_PASSWORD=testpass -p 5432:5432 -d postgres:15

# 2. Test your CLI
create-vite-shadcn-app my-test-app
cd my-test-app
cp .env.example .env.local

# 3. Edit .env.local:
# DATABASE_URL="postgresql://postgres:testpass@localhost:5432/postgres"

# 4. Run migrations
npm run db:migrate
npm run db:seed
npm run dev

# 5. Cleanup when done
docker stop test-postgres
docker rm test-postgres
```

## 🚨 Troubleshooting

### Connection Issues
```bash
# Check if PostgreSQL is running
# Windows:
services.msc
# Look for "postgresql-x64-15" service

# Or check with netstat
netstat -an | findstr 5432

# Restart PostgreSQL service
net stop postgresql-x64-15
net start postgresql-x64-15
```

### Common Errors
1. **"password authentication failed"**
   - Check your password in .env.local
   - Try connecting with psql first

2. **"database does not exist"**
   - Create the database: `CREATE DATABASE your_db_name;`

3. **"port 5432 is already in use"**
   - Another PostgreSQL instance is running
   - Change port in connection string: `:5433`

4. **"connection refused"**
   - PostgreSQL service is not running
   - Start the service or Docker container

## 💡 Recommendations for Testing

### For Development/Testing:
- **Use Docker** - Easier to setup and cleanup
- **Database name**: `myapp_test` or `cli_test`
- **User**: `postgres` with simple password like `testpass`

### For Production Apps:
- Use proper PostgreSQL installation
- Create dedicated database and user
- Use strong passwords
- Consider managed services (AWS RDS, Railway, Supabase)

## 🔗 Useful Tools

1. **pgAdmin 4** - Web-based PostgreSQL administration (installed with PostgreSQL)
2. **DBeaver** - Universal database tool ([https://dbeaver.io/](https://dbeaver.io/))
3. **Prisma Studio** - Visual database editor (`npm run db:studio`)

Your CLI app includes Prisma Studio, so after setting up PostgreSQL and running migrations, you can use:
```bash
npm run db:studio
```
This opens a web interface to view and edit your database!