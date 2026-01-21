#!/usr/bin/env node

/**
 * Database Setup Script
 * Clears caches, regenerates Prisma Client, runs migrations, and seeds the database
 */

import { execSync } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { rmSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const isRemote = process.argv.includes('--remote') || process.argv.includes('--prod');
const env = isRemote ? 'remote' : 'local';

console.log(`\n🚀 Setting up ${env} database environment...\n`);

// Step 1: Clear caches
console.log('🧹 Step 1: Clearing caches...\n');

const cacheDirs = [
  join(projectRoot, 'node_modules/.prisma'),
  join(projectRoot, 'node_modules/.vite'),
  join(projectRoot, '.wrangler'),
];

for (const cacheDir of cacheDirs) {
  try {
    rmSync(cacheDir, { recursive: true, force: true });
    console.log(`   ✅ Cleared: ${cacheDir.replace(projectRoot, '.')}`);
  } catch (error) {
    // Directory might not exist, which is fine
    if (error.code !== 'ENOENT') {
      console.error(`   ⚠️  Error clearing ${cacheDir}:`, error.message);
    }
  }
}

console.log('✅ Cache clearing completed\n');

// Step 2: Generate Prisma Client
console.log('🔧 Step 2: Generating Prisma Client...\n');

try {
  execSync('npm run prisma:generate', {
    stdio: 'inherit',
    cwd: projectRoot,
  });
  console.log('✅ Prisma Client generation completed\n');
} catch (error) {
  console.error('❌ Prisma Client generation failed:', error.message);
  process.exit(1);
}

// Step 3: Run migrations
console.log('📦 Step 3: Running database migrations...\n');

try {
  execSync(`npm run db:migrate${isRemote ? ':prod' : ''}`, {
    stdio: 'inherit',
    cwd: projectRoot,
  });
  console.log('✅ Migrations completed\n');
} catch (error) {
  console.error('❌ Migrations failed:', error.message);
  process.exit(1);
}

// Step 4: Seed database
console.log('🌱 Step 4: Seeding database...\n');

try {
  execSync(`npm run db:seed${isRemote ? ':prod' : ''}`, {
    stdio: 'inherit',
    cwd: projectRoot,
  });
  console.log('✅ Seeding completed\n');
} catch (error) {
  console.error('❌ Seeding failed:', error.message);
  process.exit(1);
}

console.log(`\n✨ ${env.charAt(0).toUpperCase() + env.slice(1)} database setup completed successfully!\n`);
