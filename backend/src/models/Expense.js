import mongoose from 'mongoose';

const { Schema } = mongoose;

const expenseSchema = new Schema(
  {
    date: { type: Date, default: Date.now },
    category: { type: String, trim: true },
    amount: { type: Number, required: true },
    vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', default: null },
    note: { type: String, default: '' },
    receiptUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Expense', expenseSchema);
