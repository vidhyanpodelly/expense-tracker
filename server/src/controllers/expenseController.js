const Expense = require('../models/Expense');
const { validationResult } = require('express-validator');

exports.getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1, createdAt: -1 });
    res.json(expenses);
  } catch (err) { next(err); }
};

exports.createExpense = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { amount, category, date, note } = req.body;
    const expense = await Expense.create({
      userId: req.user.id,
      amount,
      category,
      date,
      note
    });
    res.status(201).json(expense);
  } catch (err) { next(err); }
};

exports.updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch (err) { next(err); }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense removed' });
  } catch (err) { next(err); }
};

exports.getSummary = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });
    const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const categorySummary = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    
    res.json({ total, byCategory: categorySummary });
  } catch (err) { next(err); }
};
