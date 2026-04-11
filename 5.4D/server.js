const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

const booksRoutes = require('./routes/books.routes');

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bookDB';
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use('/api/books', booksRoutes);
app.use(express.static(path.join(__dirname, 'public')));

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    const server = app.listen(PORT, () => {
      console.log(`5.4D server listening on http://127.0.0.1:${PORT}`);
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      } else {
        console.error('Server failed to start:', err.message);
      }
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed');
    console.error(err.message);
    process.exit(1);
  });