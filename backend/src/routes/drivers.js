import { Router } from 'express';
import { body, param } from 'express-validator';
import authMiddleware from '../middleware/authMiddleware.js';
import { rbacMiddleware } from '../middleware/rbacMiddleware.js';
import {
  listDrivers,
  getDriver,
  createDriver,
  updateDriver,
  deleteDriver,
} from '../controllers/driverController.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', listDrivers);
router.get('/:id', [param('id').isMongoId().withMessage('Invalid driver id')], getDriver);

// Only admin and dispatcher can create/update/delete
router.post(
  '/',
  rbacMiddleware(['admin', 'dispatcher']),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('licenseNumber').notEmpty().withMessage('License number is required'),
  ],
  createDriver
);

router.put(
  '/:id',
  rbacMiddleware(['admin', 'dispatcher']),
  [param('id').isMongoId().withMessage('Invalid driver id')],
  updateDriver
);

router.delete('/:id', rbacMiddleware(['admin', 'dispatcher']), [param('id').isMongoId().withMessage('Invalid driver id')], deleteDriver);

export default router;
