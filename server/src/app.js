require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const { errorHandler } = require('./middleware/error');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/auth', authRoutes);
app.use('/expenses', expenseRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/expense-tracker';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
