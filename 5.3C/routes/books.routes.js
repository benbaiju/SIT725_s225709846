const express = require('express');
const router = express.Router();

const controller = require('../controllers/book.controller');

router.get('/books', controller.getAllBooks);
router.get('/books/:id', controller.getBookById);

module.exports = router;
