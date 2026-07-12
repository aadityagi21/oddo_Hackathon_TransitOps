import mongoose from 'mongoose';

const { Schema } = mongoose;

const maintenanceSchema = new Schema(
  {
    vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    reportedAt: { type: Date, default: Date.now },
    scheduledAt: { type: Date },
    completedAt: { type: Date },
    status: { type: String, enum: ['open', 'scheduled', 'in_progress', 'completed'], default: 'open' },
    cost: { type: Number, default: 0 },
    vendor: { type: String, trim: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Maintenance', maintenanceSchema);
