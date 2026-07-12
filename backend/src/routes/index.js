import { Router } from 'express';
import mongoose from 'mongoose';
import authRoutes from './auth.js';

const router = Router();

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

export default router;
