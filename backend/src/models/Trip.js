import mongoose from 'mongoose';

const { Schema } = mongoose;

const tripSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    origin: { type: String, trim: true },
    destination: { type: String, trim: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    driver: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
    passengersCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['draft', 'dispatched', 'on_route', 'completed', 'cancelled'],
      default: 'draft',
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Trip', tripSchema);
