const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'isha_portfolio';

const WALL_ITEMS = [
    {
        id: 1,
        type: 'video',
        category: 'Reels',
        src: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4',
        thumb: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
        title: 'Neon Campaigns',
        client: 'Urban Outfitters',
        desc: 'A high-energy reel designed to stop the scroll. Increased CTR by 45%.'
    },
    {
        id: 2,
        type: 'image',
        category: 'Photography',
        src: 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80&w=800',
        thumb: 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80&w=800',
        title: 'Summer Editorial',
        client: 'Vogue India',
        desc: 'Capturing the essence of Indian summer through a vintage lens.'
    },
    {
        id: 3,
        type: 'image',
        category: 'Branding',
        src: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800',
        thumb: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800',
        title: 'Minimalist Packaging',
        client: 'Pure Skin',
        desc: 'Rebranding a skincare line to appeal to Gen Z.'
    },
    {
        id: 4,
        type: 'video',
        category: 'Reels',
        src: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-neon-light-1233-large.mp4',
        thumb: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
        title: 'Fashion Week BTS',
        client: 'Lakme',
        desc: 'Behind the scenes coverage that felt intimate and raw.'
    },
    {
        id: 5,
        type: 'image',
        category: 'Photography',
        src: 'https://images.unsplash.com/photo-1529139574466-a302d27f6054?auto=format&fit=crop&q=80&w=800',
        thumb: 'https://images.unsplash.com/photo-1529139574466-a302d27f6054?auto=format&fit=crop&q=80&w=800',
        title: 'Urban Portraits',
        client: 'Personal Project',
        desc: 'Exploring light and shadow in Mumbai streets.'
    },
    {
        id: 6,
        type: 'image',
        category: 'Branding',
        src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800',
        thumb: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800',
        title: 'Tech Startup UI',
        client: 'Nexus',
        desc: 'Clean, accessible UI design for a fintech app.'
    }
];

async function seedWall() {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');

        const db = client.db(DB_NAME);
        const collection = db.collection('wall');

        // Clear existing data (optional)
        // await collection.deleteMany({});

        // Format items with timestamps
        const formattedItems = WALL_ITEMS.map((item, idx) => ({
            ...item,
            date: new Date(Date.now() - idx * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            published: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        const result = await collection.insertMany(formattedItems);
        console.log(`✅ Added ${result.insertedIds.length} wall items to the database`);
        console.log('Wall Item IDs:', Object.values(result.insertedIds));
    } catch (error) {
        console.error('❌ Error seeding wall data:', error);
    } finally {
        await client.close();
        console.log('Connection closed');
    }
}

seedWall();

