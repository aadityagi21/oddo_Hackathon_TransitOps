import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/transitops';

const seed = async () => {
  try {
    await mongoose.connect(mongoUri);

    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@transitops.test';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'password';

    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(adminPassword, salt);

    await User.create({ name: 'Admin', email: adminEmail, password: hash, role: 'admin' });

    console.log('Seed complete');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed', err);
    process.exit(1);
  }
};

seed();
