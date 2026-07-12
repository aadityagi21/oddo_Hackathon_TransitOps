import Trip from '../models/Trip.js';
import Expense from '../models/Expense.js';
import { Router } from 'express';

// Note: kept simple aggregation endpoints for reporting
export const monthlyExpenses = async (req, res, next) => {
  try {
    // Last 6 months
    const now = new Date();
    const past = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const rows = await Expense.aggregate([
      { $match: { date: { $gte: past } } },
      { $group: { _id: { year: { $year: '$date' }, month: { $month: '$date' } }, total: { $sum: '$amount' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

export const tripsByStatus = async (req, res, next) => {
  try {
    const rows = await Trip.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

export default { monthlyExpenses, tripsByStatus };
