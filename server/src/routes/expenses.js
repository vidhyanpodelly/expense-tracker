const express = require('express');
const { body } = require('express-validator');
const expenseController = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Secure all expense routes

router.route('/')
  .get(expenseController.getExpenses)
  .post(
    [
      body('amount').isFloat({ gt: 0 }),
      body('category').trim().notEmpty(),
      body('date').isISO8601()
    ],
    expenseController.createExpense
  );

router.get('/summary', expenseController.getSummary);

router.route('/:id')
  .put(expenseController.updateExpense)
  .delete(expenseController.deleteExpense);

module.exports = router;
