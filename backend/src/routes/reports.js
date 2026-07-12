import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { rbacMiddleware } from '../middleware/rbacMiddleware.js';
import reportsCtrl from '../controllers/reportsController.js';

const router = Router();

router.use(authMiddleware);

// Allow admin/dispatcher/financial_analyst to access reports
router.get('/monthly-expenses', rbacMiddleware(['admin', 'dispatcher', 'financial_analyst']), reportsCtrl.monthlyExpenses);
router.get('/trips-by-status', rbacMiddleware(['admin', 'dispatcher', 'financial_analyst']), reportsCtrl.tripsByStatus);

export default router;
