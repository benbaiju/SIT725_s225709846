const bookService = require('../services/books.service');

const CREATE_FIELDS = ["id","title","author","year","genre","summary","price"];
const UPDATE_FIELDS = ["title","author","year","genre","summary","price"];

const idParam = (req) => String(req.params.id || '').trim();

const cleanBook = (book) => {
  const obj = book.toObject ? book.toObject() : book;
  delete obj._id;
  delete obj.__v;
  return obj;
};

const formatErrors = (err) => {
  const fieldMessages = {
    year: 'Year must be a number',
    price: 'Price must be a valid number'
  };

  if (err.name === 'CastError') {
    const path = err.path || 'field';
    return [
      fieldMessages[path] ||
        (typeof err.message === 'string' ? err.message : `${path} is invalid`)
    ];
  }

  if (!err.errors) {
    return [typeof err.message === 'string' ? err.message : 'Validation failed'];
  }

  return Object.values(err.errors).map((e) => {
    if (e.name === 'CastError') {
      return fieldMessages[e.path] || `${e.path} is invalid`;
    }
    return e.message;
  });
};

const getAllBooks = async (req, res) => {
  try {
    const books = await bookService.getAllBooks();
    const cleaned = books.map(b => cleanBook(b));
    res.json(cleaned);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const id = idParam(req);

    if (!id) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const book = await bookService.getBookById(id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(cleanBook(book));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createBook = async (req, res) => {
  try {
    const incomingFields = Object.keys(req.body);

    const invalidFields = incomingFields.filter(f => !CREATE_FIELDS.includes(f));
    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: "Unknown fields: " + invalidFields.join(", ")
      });
    }

    const missingFields = CREATE_FIELDS.filter(f => !(f in req.body));
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields: " + missingFields.join(", ")
      });
    }

    const book = await bookService.createBook(req.body);

    return res.status(201).json(cleanBook(book));

  } catch (err) {

    if (err.code === 11000) {
      return res.status(409).json({ message: "Duplicate ID" });
    }

    if (err.name === 'CastError' || err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: formatErrors(err)
      });
    }

    return res.status(500).json({ message: err.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const id = idParam(req);

    if (!id) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const incomingFields = Object.keys(req.body);

    if (incomingFields.length === 0) {
      return res.status(400).json({
        message: "No fields provided for update"
      });
    }
    if ("id" in req.body) {
      return res.status(400).json({
        message: "ID cannot be changed"
      });
    }
    const invalidFields = incomingFields.filter(f => !UPDATE_FIELDS.includes(f));
    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: "Unknown fields: " + invalidFields.join(", ")
      });
    }

    if ("id" in req.body) {
      return res.status(400).json({
        message: "ID cannot be changed"
      });
    }

    const requiredFields = ["title","author","year","genre","summary","price"];

    const missingFields = requiredFields.filter(f => !(f in req.body));
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields: " + missingFields.join(", ")
      });
    }

    const updatedBook = await bookService.updateBook(id, req.body);

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(cleanBook(updatedBook));

  } catch (err) {

    if (err.name === 'CastError' || err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: formatErrors(err)
      });
    }

    return res.status(500).json({ message: err.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const id = idParam(req);

    if (!id) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const deleted = await bookService.deleteBook(id);

    if (!deleted) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.sendStatus(204);

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};