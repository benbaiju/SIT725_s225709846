const Book = require('../models/Book');

const books = [
  new Book(
    'b1',
    'The Three-Body Problem',
    'Liu Cixin',
    2008,
    'Science Fiction',
    "The Three-Body Problem is the first novel in the Remembrance of Earth's Past trilogy. The series portrays a fictional past, present, and future wherein Earth encounters an alien civilization from a nearby system of three Sun-like stars orbiting one another, a representative example of the three-body problem in orbital mechanics."
  ),
  new Book(
    'b2',
    'Jane Eyre',
    'Charlotte Brontë',
    1847,
    'Classic',
    'An orphaned governess confronts class, morality, and love at Thornfield Hall, uncovering Mr. Rochester’s secret and forging her own independence.'
  ),
  new Book(
    'b3',
    'Pride and Prejudice',
    'Jane Austen',
    1813,
    'Classic',
    'Elizabeth Bennet and Mr. Darcy navigate pride, misjudgement, and social expectations in a sharp study of manners and marriage.'
  ),
  new Book(
    'b4',
    'The English Patient',
    'Michael Ondaatje',
    1992,
    'Historical Fiction',
    'In a ruined Italian villa at the end of WWII, four strangers with intersecting pasts confront memory, identity, and loss.'
  ),
  new Book(
    'b5',
    'Small Gods',
    'Terry Pratchett',
    1992,
    'Fantasy',
    'In Omnia, the god Om returns as a tortoise, and novice Brutha must confront dogma, empire, and the nature of belief.'
  )
];

const getAllBooks = () => books;

const getBookById = (id) => books.find((book) => book.id === id);

module.exports = {
  getAllBooks,
  getBookById
};
