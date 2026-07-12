import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';
import Trip from '../models/Trip.js';

// Helper to check overlap for vehicle or driver
const hasOverlap = (start, end, existing) => {
  return (start < existing.endTime) && (end > existing.startTime);
};

export const listTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find().populate('vehicle driver');
    res.json({ success: true, data: trips });
  } catch (err) {
    next(err);
  }
};

export const getTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findById(id).populate('vehicle driver');
    if (!trip) return next(new ApiError(404, 'Trip not found'));
    res.json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
};

export const createTrip = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new ApiError(400, 'Validation failed', errors.array()));

    const { title, origin, destination, startTime, endTime, vehicle, driver, passengersCount, notes } = req.body;

    const start = new Date(startTime);
    const end = new Date(endTime);
    if (start >= end) return next(new ApiError(400, 'Invalid time range'));

    // Check overlapping trips for vehicle
    const vehicleConflicts = await Trip.findOne({ vehicle, status: { $ne: 'cancelled' }, $or: [
      { startTime: { $lt: end }, endTime: { $gt: start } }
    ]});
    if (vehicleConflicts) return next(new ApiError(409, 'Vehicle has a conflicting trip in the given time range'));

    // Check overlapping trips for driver
    const driverConflicts = await Trip.findOne({ driver, status: { $ne: 'cancelled' }, $or: [
      { startTime: { $lt: end }, endTime: { $gt: start } }
    ]});
    if (driverConflicts) return next(new ApiError(409, 'Driver has a conflicting trip in the given time range'));

    const trip = await Trip.create({ title, origin, destination, startTime: start, endTime: end, vehicle, driver, passengersCount, notes });
    res.status(201).json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
};

export const updateTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const trip = await Trip.findById(id);
    if (!trip) return next(new ApiError(404, 'Trip not found'));

    // If user is driver, only allow status updates and only if they are assigned driver
    if (req.user && req.user.role === 'driver') {
      if (String(trip.driver) !== String(req.user._id)) return next(new ApiError(403, 'Forbidden'));
      if (!update.status) return next(new ApiError(403, 'Drivers may only update trip status'));
      trip.status = update.status;
      await trip.save();
      return res.json({ success: true, data: trip });
    }

    // For admin/dispatcher: if changing time/vehicle/driver, check overlaps
    const start = update.startTime ? new Date(update.startTime) : trip.startTime;
    const end = update.endTime ? new Date(update.endTime) : trip.endTime;
    const vehicle = update.vehicle || trip.vehicle;
    const driver = update.driver || trip.driver;

    if (start >= end) return next(new ApiError(400, 'Invalid time range'));

    const vehicleConflicts = await Trip.findOne({ _id: { $ne: id }, vehicle, status: { $ne: 'cancelled' }, $or: [ { startTime: { $lt: end }, endTime: { $gt: start } } ] });
    if (vehicleConflicts) return next(new ApiError(409, 'Vehicle has a conflicting trip in the given time range'));

    const driverConflicts = await Trip.findOne({ _id: { $ne: id }, driver, status: { $ne: 'cancelled' }, $or: [ { startTime: { $lt: end }, endTime: { $gt: start } } ] });
    if (driverConflicts) return next(new ApiError(409, 'Driver has a conflicting trip in the given time range'));

    const updated = await Trip.findByIdAndUpdate(id, update, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findByIdAndDelete(id);
    if (!trip) return next(new ApiError(404, 'Trip not found'));
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
};

export default { listTrips, getTrip, createTrip, updateTrip, deleteTrip };
