import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const EMAIL = 'antoradhikari1612@gmail.com';

async function checkAllUsers() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not found');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      role: String,
      firebaseUid: String,
      name: String,
      emailVerified: Boolean
    }, { collection: 'users', strict: false }));

    const users = await User.find({ email: EMAIL });
    console.log(`Found ${users.length} user(s) with email ${EMAIL}:`);
    users.forEach(u => {
      console.log(`- ID: ${u._id}, role: ${u.role}, firebaseUid: ${u.firebaseUid}, name: ${u.name}`);
    });

    // Also check all users to see total count
    const allCount = await User.countDocuments();
    console.log(`Total users in collection: ${allCount}`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

checkAllUsers();