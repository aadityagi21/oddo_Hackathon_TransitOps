import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import Driver from '../models/Driver.js';
import Trip from '../models/Trip.js';
import Maintenance from '../models/Maintenance.js';
import Fuel from '../models/Fuel.js';
import Expense from '../models/Expense.js';

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

    // Seed sample trips
    const vehicles = await Vehicle.find();
    const drivers = await Driver.find();

    if (vehicles.length >= 2 && drivers.length >= 2) {
      const trip1Exists = await Trip.findOne({ title: 'Morning Run' });
      if (!trip1Exists) {
        await Trip.create({
          title: 'Morning Run',
          origin: 'Depot A',
          destination: 'Terminal 1',
          startTime: new Date(Date.now() + 3600 * 1000),
          endTime: new Date(Date.now() + 7200 * 1000),
          vehicle: vehicles[0]._id,
          driver: drivers[0]._id,
          passengersCount: 10,
          status: 'dispatched',
        });
        console.log('Sample trip Morning Run created');
      }

      const trip2Exists = await Trip.findOne({ title: 'Evening Run' });
      if (!trip2Exists) {
        await Trip.create({
          title: 'Evening Run',
          origin: 'Terminal 1',
          destination: 'Depot A',
          startTime: new Date(Date.now() + 24 * 3600 * 1000),
          endTime: new Date(Date.now() + 24 * 3600 * 1000 + 3600 * 1000),
          vehicle: vehicles[1]._id,
          driver: drivers[1]._id,
          passengersCount: 12,
          status: 'draft',
        });
        console.log('Sample trip Evening Run created');
      }
    }

    // Seed maintenance
    const maintExists = await Maintenance.findOne({ title: 'Oil Change' });
    if (!maintExists && vehicles.length) {
      await Maintenance.create({ vehicle: vehicles[0]._id, title: 'Oil Change', description: 'Routine oil change', status: 'open' });
      console.log('Sample maintenance created');
    }

    // Seed fuel
    const fuelExists = await Fuel.findOne({ liters: 50 });
    if (!fuelExists && vehicles.length) {
      await Fuel.create({ vehicle: vehicles[0]._id, liters: 50, cost: 100, odometer: 12100 });
      console.log('Sample fuel record created');
    }

    // Seed expense
    const expenseExists = await Expense.findOne({ amount: 200 });
    if (!expenseExists) {
      await Expense.create({ date: new Date(), category: 'Tolls', amount: 200, note: 'Highway tolls' });
      console.log('Sample expense created');
    }

    console.log('Seed complete');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed', err);
    process.exit(1);
  }
};

seed();
