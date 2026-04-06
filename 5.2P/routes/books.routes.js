const express = require('express');
const router = express.Router();

const controller = require('../controllers/book.controller');

router.get('/api/books', controller.getAllBooks);
router.get('/api/books/:id', controller.getBookById);

module.exports = router;