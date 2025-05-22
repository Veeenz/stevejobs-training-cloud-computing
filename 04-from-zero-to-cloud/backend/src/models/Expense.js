const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  date: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['expense', 'income'],
    default: 'expense'
  },
  paidBy: {
    type: String
  },
  splitTo: [{
    type: String
  }]
});

module.exports = mongoose.model('Expense', ExpenseSchema); 