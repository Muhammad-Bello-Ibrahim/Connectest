// scripts/fix-clubs.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const MONGO_URI = process.env.MONGODB_URI;

// Example: update these to match your automatching logic
const clubUpdates = [
  {
    name: 'NAcos',
    type: 'department',
    faculty: 'SC',
    department: 'CS',
  },
  {
    name: 'Nass',
    type: 'department',
    faculty: 'SC',
    department: 'SS',
  },
  {
    name: 'Gossa',
    type: 'state',
    state: 'Gombe',
  },
  {
    name: 'Mssn',
    type: 'religion',
    religion: 'islam',
  },
];

async function main() {
  await mongoose.connect(MONGO_URI!);
  const Club = (await import('../lib/models/Club')).default;
  for (const update of clubUpdates) {
    const club = await Club.findOne({ name: update.name });
    if (club) {
      Object.assign(club, update);
      await club.save();
      console.log(`Updated club: ${club.name}`);
    } else {
      await Club.create(update);
      console.log(`Created club: ${update.name}`);
    }
  }
  process.exit(0);
}

main().catch((err) => {
  console.error('Error fixing clubs:', err);
  process.exit(1);
});
