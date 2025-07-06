// scripts/print-clubs.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const MONGO_URI = process.env.MONGODB_URI;

async function main() {
  await mongoose.connect(MONGO_URI!);
  const Club = (await import('../lib/models/Club')).default;
  const clubs = await Club.find({});
  for (const club of clubs) {
    console.log({
      _id: club._id.toString(),
      name: club.name,
      type: club.type,
      faculty: club.faculty,
      department: club.department,
      state: club.state,
      religion: club.religion,
    });
  }
  process.exit(0);
}

main().catch((err) => {
  console.error('Error printing clubs:', err);
  process.exit(1);
});
