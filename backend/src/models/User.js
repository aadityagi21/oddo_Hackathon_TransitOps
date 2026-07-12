import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'dispatcher', 'driver', 'user'], default: 'user' },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
