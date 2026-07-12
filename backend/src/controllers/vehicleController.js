import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';
import Vehicle from '../models/Vehicle.js';

export const listVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find().populate('assignedDriver');
    res.json({ success: true, data: vehicles });
  } catch (err) {
    next(err);
  }
};

export const getVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findById(id).populate('assignedDriver');
    if (!vehicle) return next(new ApiError(404, 'Vehicle not found'));
    res.json({ success: true, data: vehicle });
  } catch (err) {
    next(err);
  }
};

export const createVehicle = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new ApiError(400, 'Validation failed', errors.array()));

    const { make, model, registrationNumber, capacity, status, odometer, assignedDriver, notes } = req.body;

    const existing = await Vehicle.findOne({ registrationNumber });
    if (existing) return next(new ApiError(409, 'Vehicle with this registration number already exists'));

    const vehicle = await Vehicle.create({ make, model, registrationNumber, capacity, status, odometer, assignedDriver, notes });
    res.status(201).json({ success: true, data: vehicle });
  } catch (err) {
    next(err);
  }
};

export const updateVehicle = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new ApiError(400, 'Validation failed', errors.array()));

    const { id } = req.params;
    const update = req.body;

    const vehicle = await Vehicle.findByIdAndUpdate(id, update, { new: true });
    if (!vehicle) return next(new ApiError(404, 'Vehicle not found'));

    res.json({ success: true, data: vehicle });
  } catch (err) {
    next(err);
  }
};

export const deleteVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findByIdAndDelete(id);
    if (!vehicle) return next(new ApiError(404, 'Vehicle not found'));
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
};

export default { listVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle };
