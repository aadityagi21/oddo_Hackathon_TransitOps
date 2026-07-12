import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import dashboardCtrl from '../controllers/dashboardController.js';

const router = Router();
router.use(authMiddleware);
router.get('/overview', dashboardCtrl.overview);

export default router;
