import mongoose from 'mongoose';

const { Schema } = mongoose;

const vehicleSchema = new Schema(
  {
    make: { type: String, trim: true },
    model: { type: String, trim: true },
    registrationNumber: { type: String, required: true, unique: true, trim: true },
    capacity: { type: Number, default: 0 },
    status: { type: String, enum: ['available', 'in_service', 'maintenance'], default: 'available' },
    odometer: { type: Number, default: 0 },
    assignedDriver: { type: Schema.Types.ObjectId, ref: 'Driver', default: null },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Vehicle', vehicleSchema);
