import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri: string = process.env.MONGODB_URI;
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

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

async function createConnection(): Promise<MongoClient> {
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
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createConnection();
  }
  clientPromise = global._mongoClientPromise;
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
      global._mongoClientPromise = undefined;
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
