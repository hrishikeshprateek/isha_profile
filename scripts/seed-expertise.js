const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

const initialData = {
  title: 'My Creative Universe',
  subtitle: 'Drag the icons to explore the connections.',
  categories: [
    {
      id: "design",
      label: "Design",
      iconType: "design",
      angle: 315,
      radius: 240,
      color: "#F2A7A7",
      tools: [
        {
          id: "ps",
          name: "Photoshop",
          iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Adobe_Photoshop_CC_2026_icon.svg/250px-Adobe_Photoshop_CC_2026_icon.svg.png",
          color: "bg-white"
        },
        {
          id: "ai",
          name: "Illustrator",
          iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Adobe_Illustrator_CC_icon.svg/250px-Adobe_Illustrator_CC_icon.svg.png",
          color: "bg-[#330000]"
        },
        {
          id: "fi",
          name: "Figma",
          iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Figma-logo.svg/500px-Figma-logo.svg.png",
          color: "bg-[#1E1E1E]"
        },
        {
          id: "ca",
          name: "Canva",
          iconUrl: "https://upload.wikimedia.org/wikipedia/en/b/bb/Canva_Logo.svg",
          color: "bg-gradient-to-br from-[#00C4CC] to-[#7D2AE8]"
        }
      ]
    },
    {
      id: "video",
      label: "Video",
      iconType: "video",
      angle: 45,
      radius: 340,
      color: "#9999FF",
      tools: [
        {
          id: "pr",
          name: "Premiere",
          iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Adobe_Premiere_Pro_CC_2026_icon.svg/250px-Adobe_Premiere_Pro_CC_2026_icon.svg.png",
          color: "bg-white"
        },
        {
          id: "ae",
          name: "After Effects",
          iconUrl: "https://static.wikia.nocookie.net/logopedia/images/8/83/After_Effects_2025.svg",
          color: "bg-white"
        },
        {
          id: "da",
          name: "DaVinci",
          iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/DaVinci_Resolve_Studio.png/250px-DaVinci_Resolve_Studio.png",
          color: "bg-[#3B241A]"
        },
        {
          id: "cc",
          name: "CapCut",
          iconUrl: "https://upload.wikimedia.org/wikipedia/en/a/a0/Capcut-logo.svg",
          color: "bg-black"
        }
      ]
    },
    {
      id: "content",
      label: "Content",
      iconType: "content",
      angle: 135,
      radius: 290,
      color: "#15C39A",
      tools: [
        {
          id: "no",
          name: "Notion",
          iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Notion-logo.svg/120px-Notion-logo.svg.png",
          color: "bg-white border-2 border-gray-200"
        },
        {
          id: "wp",
          name: "WordPress",
          iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/WordPress_blue_logo.svg/960px-WordPress_blue_logo.svg.png?20170312030453",
          color: "bg-[#21759B]"
        },
        {
          id: "ch",
          name: "ChatGPT",
          iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/OpenAI_logo_2025_%28symbol%29.svg/960px-OpenAI_logo_2025_%28symbol%29.svg.png",
          color: "bg-[#74AA9C]"
        }
      ]
    },
    {
      id: "photo",
      label: "Photo",
      iconType: "photo",
      angle: 225,
      radius: 190,
      color: "#2FA3F7",
      tools: [
        {
          id: "lr",
          name: "Lightroom",
          iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Adobe_Photoshop_Lightroom_CC_logo.svg/500px-Adobe_Photoshop_Lightroom_CC_logo.svg.png",
          color: "bg-[#001E36]"
        },
        {
          id: "sn",
          name: "Snapseed",
          iconUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/d/db/Snapseed_Logo.svg/1280px-Snapseed_Logo.svg.png",
          color: "bg-white border-2 border-green-500"
        }
      ]
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
};

async function seedExpertiseData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('ishra0317_db_user');
    const collection = db.collection('expertise');

    // Check if data already exists
    const existing = await collection.findOne({});
    if (existing) {
      console.log('⚠️  Expertise data already exists. Skipping seed.');
      return;
    }

    // Insert initial data
    await collection.insertOne(initialData);
    console.log('✅ Expertise data seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding expertise data:', error);
  } finally {
    await client.close();
    console.log('🔒 Connection closed');
  }
}

seedExpertiseData();

