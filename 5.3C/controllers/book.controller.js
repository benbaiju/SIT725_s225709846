const bookService = require('../services/books.service');

const getAllBooks = async (req, res) => {
  const books = await bookService.getAllBooks();
  res.json(books);
};

const getBookById = async (req, res) => {
  const book = await bookService.getBookById(req.params.id);

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  res.json(book);
};

module.exports = {
  getAllBooks,
  getBookById
};