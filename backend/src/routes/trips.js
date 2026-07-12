import { Router } from 'express';
import { body, param } from 'express-validator';
import authMiddleware from '../middleware/authMiddleware.js';
import { rbacMiddleware } from '../middleware/rbacMiddleware.js';
import * as tripCtrl from '../controllers/tripController.js';

const router = Router();

router.use(authMiddleware);

router.get('/', tripCtrl.listTrips);
router.get('/:id', [param('id').isMongoId().withMessage('Invalid trip id')], tripCtrl.getTrip);

router.post(
  '/',
  rbacMiddleware(['admin', 'dispatcher']),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('startTime').notEmpty().withMessage('Start time is required'),
    body('endTime').notEmpty().withMessage('End time is required'),
    body('vehicle').isMongoId().withMessage('Vehicle id is required'),
    body('driver').isMongoId().withMessage('Driver id is required'),
  ],
  tripCtrl.createTrip
);

router.put('/:id', rbacMiddleware(['admin', 'dispatcher', 'driver']), [param('id').isMongoId().withMessage('Invalid trip id')], tripCtrl.updateTrip);
router.delete('/:id', rbacMiddleware(['admin', 'dispatcher']), [param('id').isMongoId().withMessage('Invalid trip id')], tripCtrl.deleteTrip);

export default router;
