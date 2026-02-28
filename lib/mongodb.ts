import { MongoClient, Db } from 'mongodb';

// Note: Don't throw at module import time — some build environments load files without all env vars.
// Defer validation to connection time so build doesn't fail when env vars are absent.
const uri: string = process.env.MONGODB_URI || '';
const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 45000,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: 'majority' as const,
};

let clientPromise: Promise<MongoClient>;
let retryCount = 0;
const MAX_RETRIES = 3;

// Augment the NodeJS global interface so we can persist the MongoClient promise in development.
// This avoids creating an unused local variable while still providing a typed global cache.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      _mongoClientPromise?: Promise<MongoClient>;
    }
  }
}

async function createConnection(): Promise<MongoClient> {
  if (!uri) {
    throw new Error('MONGODB_URI is not configured. Please set MONGODB_URI in your environment.');
  }

  try {
    const newClient = new MongoClient(uri, options);
    await newClient.connect();
    console.log('✅ MongoDB connected successfully');
    retryCount = 0; // Reset retry count on successful connection
    return newClient;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(`Retrying MongoDB connection (${retryCount}/${MAX_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
      return createConnection();
    }
    throw error;
  }
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the connection
  // Use a small runtime-only interface to avoid eslint/no-explicit-any while
  // keeping access to a shared promise on globalThis.
  interface DevGlobal {
    _mongoClientPromise?: Promise<MongoClient>;
  }
  const g = globalThis as unknown as DevGlobal;
  if (!g._mongoClientPromise) {
    g._mongoClientPromise = createConnection();
  }
  clientPromise = g._mongoClientPromise as Promise<MongoClient>;
} else {
  // In production mode, use persistent connection with pooling
  clientPromise = createConnection();
}

export default clientPromise;

// Helper to get database with error handling
export async function getDatabase(): Promise<Db> {
  try {
    const mongoClient = await clientPromise;
    return mongoClient.db(process.env.MONGODB_DB || 'isha_portfolio');
  } catch (error) {
    console.error('Failed to get database:', error);
    // Try to reconnect
    if (process.env.NODE_ENV === 'development') {
      (globalThis as unknown as { _mongoClientPromise?: Promise<MongoClient> })._mongoClientPromise = undefined;
    }
    throw error;
  }
}

// Collections
export const Collections = {
  USERS: 'users',
  BLOG_POSTS: 'blog_posts',
  PROJECTS: 'projects',
  CONTACTS: 'contacts',
  SUBSCRIBERS: 'subscribers',
  VCARD: 'vcard',
  BLOGS: 'blogs',
  QUOTES: 'quotes',
  TESTIMONIALS: 'testimonials',
  MEDIA: 'media',
} as const;
