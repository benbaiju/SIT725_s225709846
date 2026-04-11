const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'ID is required'],
      unique: true,
      immutable: true,
      trim: true,
      minlength: [1, 'ID cannot be empty'],
      match: [/^[bB][0-9]+$/, 'ID must be a valid book ID']
    },

    title: {
      type: String,
      required: [true, 'Title is required'],
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
      trim: true
    },

    author: {
      type: String,
      required: [true, 'Author is required'],
      minlength: [2, 'Author name too short'],
      maxlength: [50, 'Author name too long'],
      trim: true
    },

    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1000, 'Year too old'],
      validate: {
        validator: function (v) {
          return v <= new Date().getFullYear();
        },
        message: 'Year cannot be in future'
      }
    },

    genre: {
      type: String,
      required: [true, 'Genre is required'],
      enum: {
        values: [
          'Fiction',
          'Non-Fiction',
          'Sci-Fi',
          'Science Fiction',
          'Fantasy',
          'Classic',
          'Historical Fiction',
          'Other'
        ],
        message: 'Invalid genre'
      }
    },

    summary: {
      type: String,
      required: [true, 'Summary is required'],
      minlength: [10, 'Summary too short'],
      maxlength: [500, 'Summary too long'],
      trim: true
    },

    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: [true, 'Price is required'],
      get: v => (v ? v.toString() : null),
      validate: {
        validator: function (v) {
          if (!v) return false;
          const num = Number(v.toString());
          return !isNaN(num) && num > 0;
        },
        message: 'Price must be greater than 0'
      }
    }
  },
  {
    toJSON: { getters: true },
    toObject: { getters: true }
  }
);

module.exports = mongoose.model('Book', bookSchema);