#!/usr/bin/env node

/**
 * Quick Admin User Creation Script
 * Creates admin user directly without prompts
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function createAdminUser() {
  console.log('\n🚀 Creating Admin User...\n');

  try {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db(process.env.MONGODB_DB || 'isha_portfolio');
    const usersCollection = db.collection('users');

    // Check if admin exists
    const existingAdmin = await usersCollection.findOne({
      email: 'admin@isharani.in'
    });

    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}\n`);
      await client.close();
      return;
    }

    // Hash password
    const password = 'AdminPass123!';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    const result = await usersCollection.insertOne({
      email: 'admin@isharani.in',
      password: hashedPassword,
      displayName: 'Isha Rani',
      photoURL: '',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    });

    console.log('✅ Admin user created successfully!\n');
    console.log('📊 User Details:');
    console.log(`   ID: ${result.insertedId}`);
    console.log(`   Email: admin@isharani.in`);
    console.log(`   Display Name: Isha Rani`);
    console.log(`   Role: admin`);
    console.log(`   Password: AdminPass123!\n`);

    await client.close();
    console.log('✅ Ready to use!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdminUser();

