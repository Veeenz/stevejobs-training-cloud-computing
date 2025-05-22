const Expense = require('../models/Expense');
const splitHelper = require('../util/split');

// GET /summary/month?year=YYYY&month=MM
exports.getMonthlySummary = async (req, res) => {
  try {
    const { year, month } = req.query;
    if (!year || !month) return res.status(400).json({ error: 'year and month required' });
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    const summary = await Expense.aggregate([
      { $match: { date: { $gte: start, $lt: end } } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /summary/split?people=a,b,c
exports.getSplitSummary = async (req, res) => {
  try {
    const { people } = req.query;
    if (!people) return res.status(400).json({ error: 'people required' });
    const peopleArr = people.split(',');
    const expenses = await Expense.find({});
    const result = splitHelper(expenses, peopleArr);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /stats/tags?year=YYYY&month=MM&type=TYPE&paidBy=NAME
exports.getTagStats = async (req, res) => {
  try {
    const { year, month, type, paidBy } = req.query;
    // Validate query parameters
    if (month && !year) {
      return res.status(400).json({ error: 'year is required if month is provided' });
    }
    let match = {};
    if (year) {
      const y = parseInt(year);
      if (isNaN(y)) return res.status(400).json({ error: 'Invalid year' });
      let start, end;
      if (month) {
        const m = parseInt(month);
        if (isNaN(m) || m < 1 || m > 12) return res.status(400).json({ error: 'Invalid month' });
        start = new Date(y, m - 1, 1);
        end = new Date(y, m, 1);
      } else {
        start = new Date(y, 0, 1);
        end = new Date(y + 1, 0, 1);
      }
      match.date = { $gte: start, $lt: end };
    }
    if (type) match.type = type;
    if (paidBy) match.paidBy = paidBy;
    const pipeline = [
      Object.keys(match).length ? { $match: match } : null,
      { $unwind: "$tags" },
      { $group: {
        _id: "$tags",
        totalAmount: { $sum: "$amount" },
        count: { $sum: 1 },
        avgAmount: { $avg: "$amount" }
      }},
      { $project: {
        _id: 0,
        tag: "$_id",
        totalAmount: 1,
        count: 1,
        avgAmount: 1
      }},
      { $sort: { totalAmount: -1 } }
    ].filter(Boolean);
    const stats = await Expense.aggregate(pipeline);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 