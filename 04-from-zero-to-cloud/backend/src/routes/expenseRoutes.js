const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { validateExpense } = require('../middleware/validate');
const { validationResult } = require('express-validator');

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

router.post('/', validateExpense, handleValidationErrors, expenseController.createExpense);
router.get('/', expenseController.getExpenses);
router.get('/:id', expenseController.getExpenseById);
router.patch('/:id', validateExpense, handleValidationErrors, expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

module.exports = router; 