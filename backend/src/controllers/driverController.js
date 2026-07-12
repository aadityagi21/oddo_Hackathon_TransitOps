import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';
import Driver from '../models/Driver.js';

export const listDrivers = async (req, res, next) => {
  try {
    const drivers = await Driver.find().populate('assignedVehicle');
    res.json({ success: true, data: drivers });
  } catch (err) {
    next(err);
  }
};

export const getDriver = async (req, res, next) => {
  try {
    const { id } = req.params;
    const driver = await Driver.findById(id).populate('assignedVehicle');
    if (!driver) return next(new ApiError(404, 'Driver not found'));
    res.json({ success: true, data: driver });
  } catch (err) {
    next(err);
  }
};

export const createDriver = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new ApiError(400, 'Validation failed', errors.array()));

    const { name, licenseNumber, phone, status, assignedVehicle, notes } = req.body;

    const existing = await Driver.findOne({ licenseNumber });
    if (existing) return next(new ApiError(409, 'Driver with this license number already exists'));

    const driver = await Driver.create({ name, licenseNumber, phone, status, assignedVehicle, notes });
    res.status(201).json({ success: true, data: driver });
  } catch (err) {
    next(err);
  }
};

export const updateDriver = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new ApiError(400, 'Validation failed', errors.array()));

    const { id } = req.params;
    const update = req.body;

    const driver = await Driver.findByIdAndUpdate(id, update, { new: true });
    if (!driver) return next(new ApiError(404, 'Driver not found'));

    res.json({ success: true, data: driver });
  } catch (err) {
    next(err);
  }
};

export const deleteDriver = async (req, res, next) => {
  try {
    const { id } = req.params;
    const driver = await Driver.findByIdAndDelete(id);
    if (!driver) return next(new ApiError(404, 'Driver not found'));
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
};

export default { listDrivers, getDriver, createDriver, updateDriver, deleteDriver };
