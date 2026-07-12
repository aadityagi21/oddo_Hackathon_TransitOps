import mongoose from 'mongoose';

const { Schema } = mongoose;

const fuelSchema = new Schema(
  {
    vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    date: { type: Date, default: Date.now },
    liters: { type: Number, required: true },
    cost: { type: Number, default: 0 },
    odometer: { type: Number, default: 0 },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Fuel', fuelSchema);
