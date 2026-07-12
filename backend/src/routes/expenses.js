import { Router } from 'express';
import { body, param } from 'express-validator';
import authMiddleware from '../middleware/authMiddleware.js';
import { rbacMiddleware } from '../middleware/rbacMiddleware.js';
import expenseCtrl from '../controllers/expenseController.js';

const router = Router();

router.use(authMiddleware);

router.get('/', expenseCtrl.listExpenses);
router.get('/:id', [param('id').isMongoId().withMessage('Invalid id')], expenseCtrl.getExpense);

router.post('/', rbacMiddleware(['admin', 'dispatcher']), [body('amount').isNumeric().withMessage('Amount required')], expenseCtrl.createExpense);
router.put('/:id', rbacMiddleware(['admin', 'dispatcher']), [param('id').isMongoId().withMessage('Invalid id')], expenseCtrl.updateExpense);
router.delete('/:id', rbacMiddleware(['admin', 'dispatcher']), [param('id').isMongoId().withMessage('Invalid id')], expenseCtrl.deleteExpense);

export default router;
