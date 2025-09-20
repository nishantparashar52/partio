import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import User from './models/User';
import Party from './models/Party';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/parties';

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to Mongo');

  // Create/ensure host user
  const hostEmail = 'host@example.com';
  let host = await User.findOne({ email: hostEmail });
  if (!host) host = await User.create({ email: hostEmail, name: 'Host User' });

  // Clear existing parties for clean seed
  await Party.deleteMany({ hostId: host._id });

  const base = { lat: 12.9716, lng: 77.5946 }; // Bengaluru
  const cats = ['music', 'food', 'tech', 'sports', 'gaming'];

  const now = new Date();
  const parties = Array.from({ length: 10 }).map((_, i) => {
    const dx = (Math.random() - 0.5) * 0.1;
    const dy = (Math.random() - 0.5) * 0.1;
    const date = new Date(now.getTime() + (i + 1) * 24*60*60*1000);
    return {
      title: `Seed Party ${i + 1}`,
      description: 'Sample party in Bengaluru for demo purposes.',
      category: cats[i % cats.length],
      visibility: i % 3 === 0 ? 'private' : 'public',
      date,
      startTime: '19:00',
      endTime: '22:00',
      location: { name: 'Bengaluru', geo: { type: 'Point', coordinates: [base.lng + dx, base.lat + dy] } },
      capacity: 10 + i,
      price: 0,
      hostId: host._id,
      tags: ['demo', 'blr']
    } as any;
  });

  const created = await Party.insertMany(parties);
  console.log(`Created ${created.length} parties. Host: ${hostEmail}`);
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
