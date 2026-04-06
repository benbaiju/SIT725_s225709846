const path = require('path');
const express = require('express');
const app = express();
const booksRoutes = require('./routes/books.routes');

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.use(booksRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});