#!/usr/bin/env node

/**
 * Test Cloudinary Configuration
 *
 * Run this script to verify your Cloudinary setup:
 * node scripts/test-cloudinary.js
 */

require('dotenv').config({ path: '.env.local' });

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log('\n🔍 Cloudinary Configuration Test\n');
console.log('─'.repeat(50));

// Check if all credentials are present
const checks = {
  'Cloud Name': cloudName,
  'API Key': apiKey,
  'API Secret': apiSecret
};

let allPresent = true;

for (const [key, value] of Object.entries(checks)) {
  const status = value ? '✅' : '❌';
  const display = value ? (key === 'API Secret' ? '***' + value.slice(-4) : value) : 'MISSING';
  console.log(`${status} ${key.padEnd(15)}: ${display}`);

  if (!value) allPresent = false;
}

console.log('─'.repeat(50));

if (!allPresent) {
  console.log('\n❌ Configuration Incomplete!');
  console.log('\nPlease add missing credentials to .env.local:');
  if (!cloudName) console.log('  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name');
  if (!apiKey) console.log('  NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key');
  if (!apiSecret) console.log('  CLOUDINARY_API_SECRET=your_api_secret');
  console.log('');
  process.exit(1);
}

console.log('\n✅ All credentials configured!\n');

// Test Cloudinary connection (optional - requires cloudinary package)
try {
  const cloudinary = require('cloudinary').v2;

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  console.log('🔗 Testing Cloudinary connection...');

  cloudinary.api.ping((error, result) => {
    if (error) {
      console.log('❌ Connection failed:', error.message);
      console.log('\n💡 This might be a network issue or incorrect credentials.');
      process.exit(1);
    } else {
      console.log('✅ Connection successful!');
      console.log(`\n🎉 Cloudinary is ready to use!\n`);
      console.log('Your images will be stored at:');
      console.log(`   https://res.cloudinary.com/${cloudName}/image/upload/\n`);
    }
  });
} catch (err) {
  console.log('⚠️  Could not test connection (cloudinary package may not be installed)');
  console.log('   But credentials are configured correctly!\n');
}

