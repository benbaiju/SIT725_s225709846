class Book {
  constructor(id, title, author, year, genre, summary) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.year = year;
    this.genre = genre;
    this.summary = summary;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      year: this.year,
      genre: this.genre,
      summary: this.summary
    };
  }
}

module.exports = Book;
