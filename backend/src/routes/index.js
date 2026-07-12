import express from 'express';
import authRoutes from './auth.js';
import driverRoutes from './drivers.js';
import vehicleRoutes from './vehicles.js';
import tripRoutes from './trips.js';
import maintenanceRoutes from './maintenance.js';
import fuelRoutes from './fuel.js';
import expenseRoutes from './expenses.js';
import dashboardRoutes from './dashboard.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/health', (_req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  res.status(200).json({
    success: true,
    message: 'TransitOps API is running',
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: dbStatus,
    },
  });
});

router.use('/auth', authRoutes);
router.use('/drivers', driverRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/trips', tripRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/fuel', fuelRoutes);
router.use('/expenses', expenseRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
