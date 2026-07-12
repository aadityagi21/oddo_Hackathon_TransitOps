import { Router } from 'express';
import { body, param } from 'express-validator';
import authMiddleware from '../middleware/authMiddleware.js';
import { rbacMiddleware } from '../middleware/rbacMiddleware.js';
import maintenanceCtrl from '../controllers/maintenanceController.js';

const router = Router();

router.use(authMiddleware);

router.get('/', maintenanceCtrl.listMaintenance);
router.get('/:id', [param('id').isMongoId().withMessage('Invalid id')], maintenanceCtrl.getMaintenance);

router.post('/', rbacMiddleware(['admin', 'dispatcher']), [body('vehicle').isMongoId().withMessage('Vehicle id required'), body('title').notEmpty().withMessage('Title required')], maintenanceCtrl.createMaintenance);
router.put('/:id', rbacMiddleware(['admin', 'dispatcher']), [param('id').isMongoId().withMessage('Invalid id')], maintenanceCtrl.updateMaintenance);
router.delete('/:id', rbacMiddleware(['admin', 'dispatcher']), [param('id').isMongoId().withMessage('Invalid id')], maintenanceCtrl.deleteMaintenance);

export default router;
