const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const expenseRoutes = require('./src/routes/expenseRoutes');
const summaryRoutes = require('./src/routes/summaryRoutes');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API is working properly' });
});

app.use('/expenses', expenseRoutes);
app.use('/summary', summaryRoutes);

module.exports = app; 