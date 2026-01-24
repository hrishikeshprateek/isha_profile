#!/usr/bin/env node

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb+srv://ishra0317_db_user:DVGJYhcbUkfvjOqU@ishapotfolio.porlqmo.mongodb.net/?appName=IshaPotfolio';
const dbName = process.env.MONGODB_DB || 'isha_portfolio';

const sampleServices = [
    {
        id: "01",
        title: "Content Writing",
        description: "From SEO-optimized blogs to compelling copy that converts. I craft narratives that resonate with your audience.",
        icon: 'Type',
        tags: ["Blog Posts", "SEO", "Copywriting"]
    },
    {
        id: "02",
        title: "Video Editing",
        description: "Turning raw footage into cinematic stories. Specialized in fast-paced social edits and long-form storytelling.",
        icon: 'Video',
        tags: ["Reels/Shorts", "YouTube", "Color Grading"]
    },
    {
        id: "03",
        title: "Photography",
        description: "Capturing moments with a unique perspective. Professional shooting for products, portraits, and events.",
        icon: 'Camera',
        tags: ["Portrait", "Product", "Event"]
    },
    {
        id: "04",
        title: "Branding",
        description: "More than just a logo. I build cohesive brand identities that resonate with your target audience.",
        icon: 'Palette',
        tags: ["Logo Design", "Strategy", "Tone of Voice"]
    },
    {
        id: "05",
        title: "Digital Strategy",
        description: "Strategic planning for your digital presence. From market analysis to execution roadmaps.",
        icon: 'Layers',
        tags: ["Planning", "Analytics", "Growth"]
    }
];

async function seedServices() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('services');

        // Clear existing data
        await collection.deleteMany({});
        console.log('🗑️  Cleared existing services');

        // Insert sample data
        const result = await collection.insertMany(sampleServices);
        console.log(`✅ Seeded ${result.insertedCount} services`);

        // Display inserted data
        const services = await collection.find({}).toArray();
        console.log('\n📋 Seeded Services:');
        services.forEach((service) => {
            console.log(`  - [${service.id}] ${service.title}`);
        });

    } catch (error) {
        console.error('❌ Error seeding services:', error);
        process.exit(1);
    } finally {
        await client.close();
        console.log('\n🔌 Database connection closed');
    }
}

seedServices();

