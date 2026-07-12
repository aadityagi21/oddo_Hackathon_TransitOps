import { Router } from 'express';
import { body, param } from 'express-validator';
import authMiddleware from '../middleware/authMiddleware.js';
import { rbacMiddleware } from '../middleware/rbacMiddleware.js';
import fuelCtrl from '../controllers/fuelController.js';

const router = Router();

router.use(authMiddleware);

router.get('/', fuelCtrl.listFuel);
router.get('/:id', [param('id').isMongoId().withMessage('Invalid id')], fuelCtrl.getFuel);

router.post('/', rbacMiddleware(['admin', 'dispatcher']), [body('vehicle').isMongoId().withMessage('Vehicle id required'), body('liters').isNumeric().withMessage('Liters required')], fuelCtrl.createFuel);
router.put('/:id', rbacMiddleware(['admin', 'dispatcher']), [param('id').isMongoId().withMessage('Invalid id')], fuelCtrl.updateFuel);
router.delete('/:id', rbacMiddleware(['admin', 'dispatcher']), [param('id').isMongoId().withMessage('Invalid id')], fuelCtrl.deleteFuel);

export default router;
