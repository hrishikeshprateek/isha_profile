#!/usr/bin/env node

/**
 * Admin Script: Create User from Console
 *
 * Usage:
 *   node scripts/create-user.js
 *
 * Or with npm:
 *   npm run create-user
 */

const readline = require('readline');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function createUser() {
  console.log('\n🚀 User Creation Script\n');
  console.log('=' .repeat(50));

  try {
    // Get user input
    const email = await question('Enter email: ');

    if (!isValidEmail(email)) {
      console.error('❌ Invalid email format');
      process.exit(1);
    }

    const password = await question('Enter password (min 8 chars): ');

    if (password.length < 8) {
      console.error('❌ Password must be at least 8 characters long');
      process.exit(1);
    }

    const displayName = await question('Enter display name: ');

    const roleInput = await question('Enter role (admin/user) [default: user]: ');
    const role = roleInput.toLowerCase() === 'admin' ? 'admin' : 'user';

    console.log('\n📊 Creating user with following details:');
    console.log(`   Email: ${email}`);
    console.log(`   Display Name: ${displayName}`);
    console.log(`   Role: ${role}`);
    console.log('');

    const confirm = await question('Confirm creation? (yes/no): ');

    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      console.log('❌ User creation cancelled');
      process.exit(0);
    }

    // Connect to MongoDB
    console.log('\n🔌 Connecting to MongoDB...');

    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(process.env.MONGODB_DB || 'isha_portfolio');
    const usersCollection = db.collection('users');

    // Check if user exists
    const existingUser = await usersCollection.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      console.error('❌ User with this email already exists');
      await client.close();
      process.exit(1);
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await hashPassword(password);

    // Create user document
    const newUser = {
      email: email.toLowerCase(),
      password: hashedPassword,
      displayName: displayName || email.split('@')[0],
      photoURL: '',
      role: role,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };

    // Insert user
    console.log('💾 Creating user in database...');
    const result = await usersCollection.insertOne(newUser);

    console.log('\n✅ User created successfully!');
    console.log(`   User ID: ${result.insertedId}`);
    console.log(`   Email: ${email}`);
    console.log(`   Role: ${role}`);
    console.log('');

    // Close connection
    await client.close();
    console.log('🔒 Database connection closed');

  } catch (error) {
    console.error('\n❌ Error creating user:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the script
createUser()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

