const { body } = require('express-validator');

exports.validateExpense = [
  body('description').isString().notEmpty(),
  body('amount').isFloat().withMessage('Amount must be a float'),
  body('tags').optional().isArray(),
  body('tags.*').optional().isString().notEmpty().withMessage('Tags must be non-empty strings'),
  body('date').optional().isISO8601(),
  body('type').optional().isIn(['expense', 'income']),
  body('paidBy').optional().isString(),
  body('splitTo').optional().isArray(),
  body('splitTo.*').optional().isString().notEmpty()
]; 