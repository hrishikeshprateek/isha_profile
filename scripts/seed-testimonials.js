const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'isha_portfolio';

const TESTIMONIALS = [
    {
        name: 'Sarah Johnson',
        designation: 'Creative Director',
        company: 'Design Co.',
        testimonial: 'Working with this team transformed our brand identity. Their attention to detail and creative vision were exceptional.',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
        rating: 5
    },
    {
        name: 'Michael Chen',
        designation: 'Founder',
        company: 'Tech Startup',
        testimonial: 'The content creation services exceeded our expectations. The reels brought our product to life in ways we never imagined.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
        rating: 5
    },
    {
        name: 'Emma Rodriguez',
        designation: 'Brand Manager',
        company: 'Fashion Brand',
        testimonial: 'Exceptional creativity and professionalism. The photography shoot captured our brand essence perfectly.',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100',
        rating: 5
    },
    {
        name: 'David Patel',
        designation: 'CEO',
        company: 'E-commerce Platform',
        testimonial: 'The video content directly impacted our sales. Professional, creative, and results-driven approach.',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
        rating: 5
    },
    {
        name: 'Jessica Kim',
        designation: 'Marketing Head',
        company: 'Lifestyle Brand',
        testimonial: 'Best decision we made for our digital presence. The content strategy was spot on and delivered real results.',
        image: 'https://images.unsplash.com/photo-1517010498798-e5f4eb5b1d88?auto=format&fit=crop&q=80&w=100',
        rating: 5
    },
    {
        name: 'Alex Thompson',
        designation: 'Director',
        company: 'Production House',
        testimonial: 'Incredible talent and work ethic. The final output was beyond our expectations. Highly recommended!',
        image: 'https://images.unsplash.com/photo-1519085360771-9852ef158ddd?auto=format&fit=crop&q=80&w=100',
        rating: 5
    }
];

async function seedTestimonials() {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');

        const db = client.db(DB_NAME);
        const collection = db.collection('testimonials');

        // Format items with timestamps
        const formattedItems = TESTIMONIALS.map((item, idx) => ({
            ...item,
            date: new Date(Date.now() - idx * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            published: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        const result = await collection.insertMany(formattedItems);
        console.log(`✅ Added ${result.insertedIds.length} testimonials to the database`);
        console.log('Testimonial IDs:', Object.values(result.insertedIds));
    } catch (error) {
        console.error('❌ Error seeding testimonials:', error);
    } finally {
        await client.close();
        console.log('Connection closed');
    }
}

seedTestimonials();

