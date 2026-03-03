import { getDatabase } from '@/lib/mongodb';

/**
 * Seed script to populate Instagram section data in MongoDB
 * Run this once to initialize the database with current Instagram configuration
 */

async function seedInstagramData() {
  try {
    const db = await getDatabase();
    const collection = db.collection('instagram');

    const instagramData = {
      profileUrl: 'https://www.instagram.com/moreofisha._/',
      profileHandle: 'moreofisha._',
      posts: [
        {
          id: 'post1',
          url: 'https://www.instagram.com/p/DRpYFwQDyXb/',
        },
        {
          id: 'post2',
          url: 'https://www.instagram.com/p/DUBGMakE2s5/',
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Upsert the data
    const result = await collection.updateOne(
      {},
      { $set: instagramData },
      { upsert: true }
    );

    console.log('✅ Instagram data seeded successfully!');
    console.log(`Documents matched: ${result.matchedCount}`);
    console.log(`Documents modified: ${result.modifiedCount}`);
    console.log(`Documents upserted: ${result.upsertedId ? 'Yes' : 'No'}`);
    console.log('\nSeeded data:', instagramData);

    return true;
  } catch (error) {
    console.error('❌ Error seeding Instagram data:', error);
    throw error;
  }
}

// Run the seed function
seedInstagramData()
  .then(() => {
    console.log('\n✨ Seeding complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });

