#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/* Create or update a Firebase user and set admin role, then upsert into MongoDB */
const dotenv = require('dotenv');
const path = require('path');

// Load env files (local overrides .env)
dotenv.config({ path: path.join(__dirname, '../.env.local') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const admin = require('firebase-admin');
const { MongoClient } = require('mongodb');
const readline = require('readline');

async function promptHidden(query) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const stdin = process.stdin;

    stdin.resume();
    stdin.setRawMode && stdin.setRawMode(true);

    let entered = '';
    process.stdout.write(query);

    const onData = (char) => {
      char = char + '';
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004':
          stdin.removeListener('data', onData);
          stdin.setRawMode && stdin.setRawMode(false);
          rl.close();
          process.stdout.write('\n');
          resolve(entered);
          break;
        case '\u0003': // Ctrl+C
          stdin.removeListener('data', onData);
          stdin.setRawMode && stdin.setRawMode(false);
          rl.close();
          process.stdout.write('\n');
          process.exit(1);
          break;
        default:
          // mask the character
          entered += char;
          process.stdout.write('*');
          break;
      }
    };

    stdin.on('data', onData);
  });
}

async function main() {
  const args = process.argv.slice(2);
  const email = args[0] || 'admin@isharani.in';
  let password = args[1];
  const displayName = args[2] || email.split('@')[0];

  // If password is not provided via arg, check env var
  if (!password) {
    if (process.env.CREATE_ADMIN_PASSWORD) {
      password = process.env.CREATE_ADMIN_PASSWORD;
    } else {
      // Prompt interactively (hidden input)
      password = await promptHidden('Enter password for new admin (input hidden): ');
      if (!password) {
        console.error('Password is required. Aborting.');
        process.exit(1);
      }
    }
  }

  // Special token to force interactive prompt
  if (password === '-' || password === 'PROMPT') {
    password = await promptHidden('Enter password for new admin (input hidden): ');
    if (!password) {
      console.error('Password is required. Aborting.');
      process.exit(1);
    }
  }

  if (!process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PROJECT_ID) {
    console.error('Missing Firebase admin env variables. Please set FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, FIREBASE_PROJECT_ID');
    process.exit(1);
  }

  if (!process.env.MONGODB_URI) {
    console.error('Missing MONGODB_URI in env');
    process.exit(1);
  }

  // Initialize firebase-admin if not already
  try {
    if (!admin.apps || !admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
      console.log('✅ Firebase Admin initialized');
    }
  } catch (err) {
    console.error('❌ Failed to initialize Firebase Admin:', err && err.message ? err.message : err);
    process.exit(1);
  }

  let userRecord;
  try {
    // Try to find existing user by email
    userRecord = await admin.auth().getUserByEmail(email).catch(() => null);

    if (userRecord) {
      console.log('ℹ Firebase user already exists:', userRecord.uid, userRecord.email);
      // Update displayName if different
      if ((userRecord.displayName || '') !== displayName) {
        await admin.auth().updateUser(userRecord.uid, { displayName }).catch((e) => {
          console.warn('⚠ Failed to update displayName:', e && e.message ? e.message : e);
        });
      }
      // Optionally update password
      try {
        await admin.auth().updateUser(userRecord.uid, { password });
        console.log('✅ Updated Firebase user password');
      } catch (pwErr) {
        // Updating password might fail depending on constraints; warn but continue
        console.warn('⚠ Could not update password for existing user:', pwErr && pwErr.message ? pwErr.message : pwErr);
      }
    } else {
      // Create user
      userRecord = await admin.auth().createUser({
        email,
        password,
        displayName,
        emailVerified: true,
      });
      console.log('✅ Created Firebase user:', userRecord.uid, userRecord.email);
    }

    // Set admin custom claim
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
    console.log('✅ Set custom claim { admin: true } on user:', userRecord.uid);
  } catch (err) {
    console.error('❌ Error creating/updating Firebase user:', err && err.message ? err.message : err);
    process.exit(1);
  }

  // Upsert into MongoDB users collection
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const dbName = process.env.MONGODB_DB || undefined;
    const db = dbName ? client.db(dbName) : client.db();
    const users = db.collection('users');

    const now = new Date();
    const update = {
      $set: {
        firebaseUid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName || displayName,
        role: 'admin',
        isActive: true,
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    };

    await users.updateOne({ firebaseUid: userRecord.uid }, update, { upsert: true });

    console.log('✅ Upserted user into MongoDB as admin (firebaseUid =', userRecord.uid + ')');
    await client.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ MongoDB error while upserting user:', err && err.message ? err.message : err);
    try {
      await client.close();
    } catch (_closeErr) {
      // ignore
    }
    process.exit(1);
  }
}

// Pretty usage helper when run with --help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('\nUsage: node scripts/create-admin-firebase-fixed.js [email] [password] [displayName]\n');
  console.log('If no args provided, defaults to admin@isharani.in AdminPass123!');
  console.log('\nAlternatives to passing the password as a shell arg (avoid shell-history/expansion issues):');
  console.log('  - Export CREATE_ADMIN_PASSWORD before running the script:');
  console.log("      CREATE_ADMIN_PASSWORD='Isha!7061900458' node scripts/create-admin-firebase-fixed.js me@isharani.in");
  console.log("  - Omit the password arg to be prompted interactively (input hidden):");
  console.log('      node scripts/create-admin-firebase-fixed.js me@isharani.in');
  console.log("  - Pass password token '-' or 'PROMPT' to force interactive prompt:");
  console.log("      node scripts/create-admin-firebase-fixed.js me@isharani.in -");
  process.exit(0);
}

main();
