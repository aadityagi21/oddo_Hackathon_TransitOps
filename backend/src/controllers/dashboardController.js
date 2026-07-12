import Trip from '../models/Trip.js';
import Vehicle from '../models/Vehicle.js';
import Driver from '../models/Driver.js';
import Expense from '../models/Expense.js';
import Maintenance from '../models/Maintenance.js';
import Fuel from '../models/Fuel.js';

export const overview = async (req, res, next) => {
  try {
    const vehicleCount = await Vehicle.countDocuments();
    const driverCount = await Driver.countDocuments();
    const tripCount = await Trip.countDocuments();

    const tripsByStatus = await Trip.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const vehiclesOnTrip = await Vehicle.countDocuments({ status: 'in_service' });
    // fleet utilization: vehicles on_trip / total
    const onTrip = await Trip.countDocuments({ status: 'on_route' });
    const utilization = vehicleCount > 0 ? Math.round((onTrip / vehicleCount) * 100) : 0;

    const recentTrips = await Trip.find().sort({ createdAt: -1 }).limit(10).populate('vehicle driver');
    const recentMaintenance = await Maintenance.find().sort({ createdAt: -1 }).limit(10).populate('vehicle');
    const recentExpenses = await Expense.find().sort({ createdAt: -1 }).limit(10).populate('vehicle');

    res.json({
      success: true,
      data: {
        counts: { vehicles: vehicleCount, drivers: driverCount, trips: tripCount },
        tripsByStatus,
        utilization,
        recent: { trips: recentTrips, maintenance: recentMaintenance, expenses: recentExpenses },
      },
    });
  } catch (err) {
    next(err);
  }
};

export default { overview };
