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

// Global cache interface for both dev and production
interface GlobalMongoCache {
  _mongoClientPromise?: Promise<MongoClient>;
  _mongoClient?: MongoClient;
  _connectionCount?: number;
}

// Augment the NodeJS global interface
declare global {
  var _mongoCache: GlobalMongoCache | undefined;
}

// Initialize global cache
if (!global._mongoCache) {
  global._mongoCache = {
    _connectionCount: 0,
  };
}

const cache = global._mongoCache;

async function createConnection(): Promise<MongoClient> {
  if (!uri) {
    throw new Error('MONGODB_URI is not configured. Please set MONGODB_URI in your environment.');
  }

  // Check if we already have a connected client
  if (cache._mongoClient) {
    try {
      // Ping to verify connection is still alive
      await cache._mongoClient.db().admin().ping();
      return cache._mongoClient;
    } catch {
      // Connection is dead, will reconnect
      console.warn('⚠️ Existing MongoDB connection is dead, reconnecting...');
      cache._mongoClient = undefined;
      cache._mongoClientPromise = undefined;
    }
  }

  try {
    const newClient = new MongoClient(uri, options);
    await newClient.connect();

    // Only log on actual new connections, not reuse
    if (!cache._connectionCount || cache._connectionCount === 0) {
      console.log('✅ MongoDB connected successfully');
    }
    cache._connectionCount = (cache._connectionCount || 0) + 1;
    cache._mongoClient = newClient;

    return newClient;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

// Lazy connection promise
let clientPromise: Promise<MongoClient>;

if (!cache._mongoClientPromise) {
  cache._mongoClientPromise = createConnection();
}
clientPromise = cache._mongoClientPromise;

export default clientPromise;

// Helper to get database with error handling
export async function getDatabase(): Promise<Db> {
  try {
    const mongoClient = await clientPromise;
    return mongoClient.db(process.env.MONGODB_DB || 'isha_portfolio');
  } catch (error) {
    console.error('Failed to get database:', error);
    // Clear cache and retry once
    cache._mongoClient = undefined;
    cache._mongoClientPromise = undefined;
    clientPromise = createConnection();
    cache._mongoClientPromise = clientPromise;

    const mongoClient = await clientPromise;
    return mongoClient.db(process.env.MONGODB_DB || 'isha_portfolio');
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
