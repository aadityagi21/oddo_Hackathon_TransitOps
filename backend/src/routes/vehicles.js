import { Router } from 'express';
import { body, param } from 'express-validator';
import authMiddleware from '../middleware/authMiddleware.js';
import { rbacMiddleware } from '../middleware/rbacMiddleware.js';
import {
  listVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from '../controllers/vehicleController.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', listVehicles);
router.get('/:id', [param('id').isMongoId().withMessage('Invalid vehicle id')], getVehicle);

// Only admin and dispatcher can create/update/delete
router.post(
  '/',
  rbacMiddleware(['admin', 'dispatcher']),
  [
    body('registrationNumber').notEmpty().withMessage('Registration number is required'),
  ],
  createVehicle
);

router.put(
  '/:id',
  rbacMiddleware(['admin', 'dispatcher']),
  [param('id').isMongoId().withMessage('Invalid vehicle id')],
  updateVehicle
);

router.delete('/:id', rbacMiddleware(['admin', 'dispatcher']), [param('id').isMongoId().withMessage('Invalid vehicle id')], deleteVehicle);

export default router;
