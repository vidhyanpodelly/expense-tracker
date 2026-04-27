const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, required: true, min: 0.01 },
  category: { type: String, required: true, trim: true },
  date: { type: Date, required: true, index: true },
  note: { type: String, trim: true, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
