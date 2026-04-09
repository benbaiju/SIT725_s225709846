const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

const booksRoutes = require('./routes/books.routes');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/booksDB';

app.use(express.json());
app.use('/api', booksRoutes);
app.use(express.static(path.join(__dirname, 'public')));

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(3000, () => {
      console.log('Server running on port 3000');
    });
  })
  .catch((err) => {
    console.error(err);
  });