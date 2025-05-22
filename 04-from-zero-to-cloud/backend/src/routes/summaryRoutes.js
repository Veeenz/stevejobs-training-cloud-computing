const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');

router.get('/month', summaryController.getMonthlySummary);
router.get('/split', summaryController.getSplitSummary);
router.get('/stats/tags', summaryController.getTagStats);

module.exports = router; 