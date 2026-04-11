const Book = require('../models/Book');

const getAllBooks = async () => {
  return Book.find().exec();
};

const getBookById = async (id) => {
  return Book.findOne({ id }).exec();
};

const createBook = async (data) => {
  const book = new Book(data);
  return await book.save();
};

const updateBook = async (id, data) => {
  return await Book.findOneAndUpdate(
    { id },
    data,
    {
      new: true,
      runValidators: true,
      context: 'query'
    }
  ).exec();
};

const deleteBook = async (id) => {
  return await Book.findOneAndDelete({ id }).exec();
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};