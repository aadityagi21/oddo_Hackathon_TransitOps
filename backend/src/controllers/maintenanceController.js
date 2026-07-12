import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';
import Maintenance from '../models/Maintenance.js';

export const listMaintenance = async (req, res, next) => {
  try {
    const items = await Maintenance.find().populate('vehicle');
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
};

export const getMaintenance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Maintenance.findById(id).populate('vehicle');
    if (!item) return next(new ApiError(404, 'Maintenance record not found'));
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

export const createMaintenance = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new ApiError(400, 'Validation failed', errors.array()));
    const { vehicle, title, description, scheduledAt, status, cost, vendor, notes } = req.body;
    const item = await Maintenance.create({ vehicle, title, description, scheduledAt, status, cost, vendor, notes });
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
};

export const updateMaintenance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Maintenance.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return next(new ApiError(404, 'Maintenance record not found'));
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
};

export const deleteMaintenance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Maintenance.findByIdAndDelete(id);
    if (!item) return next(new ApiError(404, 'Maintenance record not found'));
    res.json({ success: true, data: null });
  } catch (err) { next(err); }
};

export default { listMaintenance, getMaintenance, createMaintenance, updateMaintenance, deleteMaintenance };
