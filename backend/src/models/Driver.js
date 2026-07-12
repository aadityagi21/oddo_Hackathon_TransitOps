import mongoose from 'mongoose';

const { Schema } = mongoose;

const driverSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    licenseNumber: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    assignedVehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', default: null },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Driver', driverSchema);
