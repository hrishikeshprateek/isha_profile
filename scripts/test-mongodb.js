#!/usr/bin/env node

/**
 * Test MongoDB Connection
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  console.log('\n🔌 Testing MongoDB Connection...\n');
  console.log('=' .repeat(50));

  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error('❌ MONGODB_URI not found in .env.local');
    }

    console.log('📍 Connecting to MongoDB Atlas...');
    console.log(`   Database: ${process.env.MONGODB_DB || 'isha_portfolio'}\n`);

    const client = new MongoClient(uri);
    await client.connect();

    console.log('✅ Successfully connected to MongoDB!');

    const db = client.db(process.env.MONGODB_DB || 'isha_portfolio');

    // List collections
    const collections = await db.listCollections().toArray();

    console.log(`\n📊 Existing collections (${collections.length}):`);
    if (collections.length === 0) {
      console.log('   (No collections yet - they will be created automatically)');
    } else {
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
    }

    // Count users
    try {
      const usersCount = await db.collection('users').countDocuments();
      console.log(`\n👥 Total users: ${usersCount}`);
    } catch (e) {
      console.log('\n👥 Total users: 0 (collection not created yet)');
    }

    await client.close();
    console.log('\n🔒 Connection closed');
    console.log('\n✅ MongoDB is ready to use!\n');

  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('  1. Check MONGODB_URI in .env.local');
    console.error('  2. Verify your IP is whitelisted in MongoDB Atlas');
    console.error('  3. Check username and password are correct\n');
    process.exit(1);
  }
}

testConnection();

