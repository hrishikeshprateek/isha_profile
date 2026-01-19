#!/usr/bin/env node

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb+srv://ishra0317_db_user:DVGJYhcbUkfvjOqU@ishapotfolio.porlqmo.mongodb.net/?appName=IshaPotfolio';
const dbName = process.env.MONGODB_DB || 'isha_portfolio';

const sampleQuotes = [
    {
        text: "Design is not just what it looks like and feels like. Design is how it works.",
        author: "Steve Jobs",
        category: "Inspiration",
        published: true
    },
    {
        text: "Creativity is intelligence having fun.",
        author: "Albert Einstein",
        category: "Inspiration",
        published: true
    },
    {
        text: "Simplicity is the ultimate sophistication.",
        author: "Leonardo da Vinci",
        category: "Wisdom",
        published: true
    },
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        category: "Motivation",
        published: true
    },
    {
        text: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs",
        category: "Inspiration",
        published: true
    },
    {
        text: "Life is what happens when you're busy making other plans.",
        author: "John Lennon",
        category: "Life",
        published: true
    },
    {
        text: "The best time to plant a tree was 20 years ago. The second best time is now.",
        author: "Chinese Proverb",
        category: "Wisdom",
        published: true
    },
    {
        text: "Travel is the only thing you buy that makes you richer.",
        author: "Unknown",
        category: "Travel",
        published: true
    },
    {
        text: "Do what you can, with what you have, where you are.",
        author: "Theodore Roosevelt",
        category: "Motivation",
        published: true
    },
    {
        text: "The journey of a thousand miles begins with a single step.",
        author: "Lao Tzu",
        category: "Travel",
        published: true
    }
];

async function addQuotes() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('quotes');

        // Add date to each quote
        const quotesWithDate = sampleQuotes.map((quote, index) => ({
            ...quote,
            date: new Date(2025, 0, 18 - index).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        const result = await collection.insertMany(quotesWithDate);
        console.log(`✅ Added ${Object.keys(result.insertedIds).length} quotes to the database`);
        console.log('Quote IDs:', Object.values(result.insertedIds).map(id => id.toString()));

    } catch (error) {
        console.error('❌ Error adding quotes:', error);
    } finally {
        await client.close();
        console.log('Connection closed');
    }
}

addQuotes();

