import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri: string = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 45000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the connection
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, ALSO use persistent connection with pooling
  // DO NOT create new client per request - this causes massive cost overages
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// Helper to get database
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB || 'isha_portfolio');
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
} as const;
