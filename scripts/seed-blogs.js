#!/usr/bin/env node
/**
 * Seed Database with Sample Blogs
 * Usage: node scripts/seed-blogs.js
 */

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'isha_portfolio';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

const sampleBlogs = [
  {
    title: "Hidden Gems of Southeast Asia",
    excerpt: "Discover the untold stories and secret locations that most travelers miss. From secluded beaches to mountain villages...",
    category: "Travel",
    date: "2026-01-10",
    readTime: "8 min read",
    author: "Isha Rani",
    image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1200&h=600&fit=crop",
    content: `<p>Southeast Asia has always been a treasure trove of experiences, but beyond the well-trodden tourist paths lie hidden gems waiting to be discovered. After spending three months exploring this incredible region, I've compiled a guide to the most enchanting secret locations that most travelers never get to see.</p><h2>The Secret Beach of Koh Rong</h2><p>While most tourists flock to Long Beach, there's a hidden cove on the eastern side of the island that remains virtually untouched. The journey requires a short hike through dense jungle, but the reward is a pristine beach with crystal-clear waters and not a soul in sight.</p><blockquote>"Sometimes the best destinations are the ones you stumble upon by accident, guided only by local whispers and your sense of adventure."</blockquote><h2>Mountain Villages of Northern Vietnam</h2><p>Beyond Sapa's tourist crowds, smaller villages like Ta Van and Lao Chai offer authentic glimpses into local life. Here, you'll find families who have lived the same way for generations, terraced rice fields that cascade down mountain slopes, and homestays where the warmth of hospitality transcends language barriers.</p><h3>What to Expect:</h3><ul><li>Traditional stilt houses with stunning valley views</li><li>Home-cooked meals prepared with locally sourced ingredients</li><li>Morning mist rolling through the rice terraces</li><li>Opportunities to learn traditional crafts from local artisans</li></ul>`,
    tags: ["Southeast Asia", "Travel Tips", "Hidden Gems", "Adventure"],
    published: true,
    slug: "hidden-gems-southeast-asia"
  },
  {
    title: "Content Creation Tips for Beginners",
    excerpt: "Starting your journey as a content creator? Here are essential tips that helped me grow from zero to thousands...",
    category: "Content Creation",
    date: "2026-01-08",
    readTime: "5 min read",
    author: "Isha Rani",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=600&fit=crop",
    content: `<p>Starting your content creation journey can feel overwhelming. I remember staring at my phone, wondering if anyone would ever care about what I had to share. Three years and 100K followers later, I've learned that success in content creation isn't about perfection—it's about consistency, authenticity, and connection.</p><h2>Find Your Unique Voice</h2><p>The biggest mistake new creators make is trying to replicate what's already successful. Instead, ask yourself: What perspective can only I bring? What experiences have shaped my worldview? Your unique voice is your greatest asset.</p><blockquote>"Don't create content you think will go viral. Create content that would resonate with you if you were your own audience."</blockquote><h2>Start Before You're Ready</h2><p>Waiting for the perfect equipment, the perfect idea, or the perfect moment is a recipe for never starting. My first videos were shot on an iPhone 8 with natural lighting. What mattered wasn't production quality—it was the value I provided and the genuine connection I built with viewers.</p>`,
    tags: ["Content Creation", "Social Media", "Creator Tips", "Beginner Guide"],
    published: true,
    slug: "content-creation-tips-beginners"
  },
  {
    title: "A Week in the Himalayas",
    excerpt: "Join me on an incredible journey through the majestic Himalayan mountains, where every sunrise tells a story...",
    category: "Travel",
    date: "2026-01-05",
    readTime: "10 min read",
    author: "Isha Rani",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
    content: `<p>There's something humbling about standing in the shadow of the world's highest peaks. Last month, I spent seven days trekking through the Himalayas, and it fundamentally changed how I view challenges, beauty, and my own resilience. This isn't just a travel story—it's a journey of self-discovery wrapped in mountain mist and prayer flags.</p><h2>Day 1: Arrival in Manali</h2><p>The journey begins in chaos. Manali's streets buzz with the energy of adventure-seekers from around the world. After years of planning this trip, the reality of standing at the base of these mountains feels surreal. We meet our guide, Karma, whose weathered face tells a thousand untold stories of mountain life.</p><blockquote>"The mountains are calling and I must go." - John Muir</blockquote><h2>Day 2-3: The Ascent Begins</h2><p>Waking up at 5 AM to the sound of temple bells, we begin our trek. The first day is deceptively easy—gentle slopes through pine forests where sunlight filters through branches in golden streams. By day three, reality sets in. Altitude makes every breath deliberate, every step a negotiation with gravity.</p>`,
    tags: ["Himalayas", "Trekking", "Mountain", "Adventure", "India"],
    published: true,
    slug: "week-himalayas"
  },
  {
    title: "Building an Authentic Brand",
    excerpt: "Authenticity is key in content creation. Learn how to stay true to yourself while building a successful brand...",
    category: "Content Creation",
    date: "2026-01-03",
    readTime: "6 min read",
    author: "Isha Rani",
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200&h=600&fit=crop",
    content: `<p>In a world of filters and curated perfection, authenticity has become both rare and invaluable. Building a brand that truly represents who you are isn't just about standing out—it's about creating lasting connections with people who resonate with your genuine self.</p><h2>What Authenticity Really Means</h2><p>Authenticity doesn't mean sharing everything. It means being honest about what you do share. It's about alignment between your values, your message, and your actions.</p><blockquote>"Authenticity is the daily practice of letting go of who we think we're supposed to be and embracing who we are." - Brené Brown</blockquote><h2>Finding Your Core Values</h2><p>Before you can build an authentic brand, you need to know what you stand for. Take time to identify your core values—the non-negotiables that guide your decisions and define your identity.</p>`,
    tags: ["Branding", "Authenticity", "Personal Brand", "Marketing"],
    published: true,
    slug: "building-authentic-brand"
  },
  {
    title: "Photography Tips for Travel Vloggers",
    excerpt: "Capture stunning moments during your travels. Learn essential photography techniques for vloggers and content creators...",
    category: "Photography",
    date: "2025-12-28",
    readTime: "7 min read",
    author: "Isha Rani",
    image: "https://images.unsplash.com/photo-1599887959230-6e81a9b45f1e?w=1200&h=600&fit=crop",
    content: `<p>Photography is the art of capturing light, emotion, and moments. For travel vloggers, it's about telling stories without words. Here are the techniques that have helped me create content that resonates with millions.</p><h2>Understanding the Golden Hour</h2><p>The golden hour—that magical time shortly after sunrise or before sunset—is your best friend. The warm, soft light during these hours creates a cinematic quality that's impossible to replicate with artificial lighting.</p><h2>Composition Techniques</h2><p>Master the rule of thirds, leading lines, and framing. These fundamental composition principles will immediately elevate your photography from amateur to professional.</p>`,
    tags: ["Photography", "Travel", "Vlogging", "Camera Tips"],
    published: true,
    slug: "photography-tips-travel-vloggers"
  },
  {
    title: "Food Culture Around the World",
    excerpt: "Explore the culinary traditions and food stories from different cultures. A journey through taste...",
    category: "Food & Culture",
    date: "2025-12-25",
    readTime: "6 min read",
    author: "Isha Rani",
    image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1200&h=600&fit=crop",
    content: `<p>Food is a universal language. It tells stories of culture, tradition, and identity. Through my travels, I've learned that the most authentic way to experience a place is through its food. Every dish carries history, and every meal is an opportunity for connection.</p><h2>The Sacred Rituals of Meals</h2><p>In many cultures, eating is more than nourishment—it's a ritual. In Thailand, every meal includes a balance of sweet, sour, salty, and spicy. In Italy, meals are moments to celebrate family and togetherness. In India, food is prepared with intention and spirituality.</p><h2>Street Food Adventures</h2><p>The best meals often come from street vendors. These humble food stalls serve authentic, often generations-old recipes that you won't find in restaurants.</p>`,
    tags: ["Food", "Culture", "Travel", "Culinary"],
    published: true,
    slug: "food-culture-world"
  }
];

async function seedBlogs() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection('blogs');

    // Check if blogs already exist
    const count = await collection.countDocuments();
    if (count > 0) {
      console.log(`⚠️  Database already has ${count} blogs. Skipping seed.`);
      console.log('💡 To reset, delete the collection manually in MongoDB Atlas.');
      return;
    }

    // Add timestamps and slugs
    const blogsWithMeta = sampleBlogs.map(blog => ({
      ...blog,
      createdAt: new Date(),
      updatedAt: new Date(),
      slug: blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    }));

    const result = await collection.insertMany(blogsWithMeta);

    console.log(`✅ Successfully inserted ${result.insertedIds.length} blogs!`);
    console.log('\n📚 Blogs added:');
    sampleBlogs.forEach((blog, i) => {
      console.log(`  ${i + 1}. ${blog.title}`);
    });
    console.log('\n💡 Visit http://localhost:3000/admin/blogs to manage them');
    console.log('💡 Visit http://localhost:3000/blogs to view them');

  } catch (error) {
    console.error('❌ Error seeding blogs:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedBlogs();

