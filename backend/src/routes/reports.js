import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import reportsCtrl from '../controllers/reportsController.js';

const router = Router();

// Require authentication for reports but allow any authenticated user in dev/testing
router.use(authMiddleware);

router.get('/monthly-expenses', reportsCtrl.monthlyExpenses);
router.get('/trips-by-status', reportsCtrl.tripsByStatus);

export default router;
