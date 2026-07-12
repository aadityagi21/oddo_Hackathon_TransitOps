import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import Driver from '../models/Driver.js';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/transitops';

const seed = async () => {
  try {
    await mongoose.connect(mongoUri);

    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@transitops.test';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'password';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(adminPassword, salt);
      await User.create({ name: 'Admin', email: adminEmail, password: hash, role: 'admin' });
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }

    // Seed sample vehicles
    const sampleVehicles = [
      { make: 'Toyota', model: 'Hiace', registrationNumber: 'ABC-1001', capacity: 15, status: 'available', odometer: 12000 },
      { make: 'Mercedes', model: 'Sprinter', registrationNumber: 'ABC-1002', capacity: 20, status: 'available', odometer: 5000 },
    ];

    for (const v of sampleVehicles) {
      const exists = await Vehicle.findOne({ registrationNumber: v.registrationNumber });
      if (!exists) {
        await Vehicle.create(v);
        console.log(`Vehicle ${v.registrationNumber} created`);
      }
    }

    // Seed sample drivers
    const sampleDrivers = [
      { name: 'John Doe', licenseNumber: 'LIC-1001', phone: '555-0101' },
      { name: 'Jane Smith', licenseNumber: 'LIC-1002', phone: '555-0102' },
    ];

    for (const d of sampleDrivers) {
      const exists = await Driver.findOne({ licenseNumber: d.licenseNumber });
      if (!exists) {
        await Driver.create(d);
        console.log(`Driver ${d.licenseNumber} created`);
      }
    }

    console.log('Seed complete');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed', err);
    process.exit(1);
  }
};

seed();
