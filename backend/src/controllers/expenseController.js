import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';
import Expense from '../models/Expense.js';

export const listExpenses = async (req, res, next) => {
  try {
    const items = await Expense.find().populate('vehicle');
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
};

export const getExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Expense.findById(id).populate('vehicle');
    if (!item) return next(new ApiError(404, 'Expense not found'));
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

export const createExpense = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new ApiError(400, 'Validation failed', errors.array()));
    const { date, category, amount, vehicle, note, receiptUrl } = req.body;
    const item = await Expense.create({ date, category, amount, vehicle, note, receiptUrl });
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
};

export const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Expense.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return next(new ApiError(404, 'Expense not found'));
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Expense.findByIdAndDelete(id);
    if (!item) return next(new ApiError(404, 'Expense not found'));
    res.json({ success: true, data: null });
  } catch (err) { next(err); }
};

export default { listExpenses, getExpense, createExpense, updateExpense, deleteExpense };
