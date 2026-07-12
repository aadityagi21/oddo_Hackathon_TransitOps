import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';
import Fuel from '../models/Fuel.js';

export const listFuel = async (req, res, next) => {
  try {
    const items = await Fuel.find().populate('vehicle');
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
};

export const getFuel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Fuel.findById(id).populate('vehicle');
    if (!item) return next(new ApiError(404, 'Fuel record not found'));
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

export const createFuel = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new ApiError(400, 'Validation failed', errors.array()));
    const { vehicle, date, liters, cost, odometer, notes } = req.body;
    const item = await Fuel.create({ vehicle, date, liters, cost, odometer, notes });
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
};

export const updateFuel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Fuel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return next(new ApiError(404, 'Fuel record not found'));
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
};

export const deleteFuel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Fuel.findByIdAndDelete(id);
    if (!item) return next(new ApiError(404, 'Fuel record not found'));
    res.json({ success: true, data: null });
  } catch (err) { next(err); }
};

export default { listFuel, getFuel, createFuel, updateFuel, deleteFuel };
