#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/* Create a Firebase user and set admin role, then upsert into MongoDB */
const dotenv = require('dotenv');
dotenv.config();

const admin = require('firebase-admin');
const { MongoClient } = require('mongodb');

async function main() {
  const email = process.argv[2] || 'admin@isharani.in';
  const password = process.argv[3] || 'AdminPass123!';

  if (!process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PROJECT_ID) {
    console.error('Missing Firebase admin env variables. Please set FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, FIREBASE_PROJECT_ID');
    process.exit(1);
  }

  if (!process.env.MONGODB_URI) {
    console.error('Missing MONGODB_URI in env');
    process.exit(1);
  }

  // Initialize firebase-admin
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      emailVerified: true,
    });

    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });

    console.log('Created Firebase user:', userRecord.uid, userRecord.email);

    // Upsert into MongoDB users collection
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db();
    const users = db.collection('users');

    const now = new Date();
    await users.updateOne(
      { firebaseUid: userRecord.uid },
      {
        $set: {
          firebaseUid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName || userRecord.email.split('@')[0],
          role: 'admin',
          isActive: true,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );

    console.log('Upserted user into MongoDB as admin.');
    await client.close();
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
}

main();
