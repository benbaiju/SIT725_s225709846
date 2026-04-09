const Book = require('../models/Book');

const getAllBooks = async () => {
  return Book.find().exec();
};

const getBookById = async (id) => {
  return Book.findOne({ id }).exec();
};

module.exports = {
  getAllBooks,
  getBookById
};