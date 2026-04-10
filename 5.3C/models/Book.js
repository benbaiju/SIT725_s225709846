const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: String,
    author: String,
    year: Number,
    genre: String,
    summary: String,
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: (v) => (v != null && typeof v.toString === 'function' ? v.toString() : v)
    }
  },
  {
    toJSON: { getters: true },
    toObject: { getters: true }
  }
);

module.exports = mongoose.model('Book', bookSchema);