var mongoose = require("mongoose")
var Book = require("./models/book")

var books = [
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    image: "images/book3.jpg",
    link: "About this book",
    desciption:
      "Timeless lessons on wealth, greed, and happiness. How people think about money and behavior."
  },
  {
    title: "The Chronicles of Narnia",
    author: "C. S. Lewis",
    image: "images/book4.jpg",
    link: "About this book",
    desciption:
      "Classic fantasy tales of children who discover the world of Narnia through the wardrobe. Adventure, allegory, and memorable talking beasts."
  },
  {
    title: "Shoe Dog",
    author: "Phil Knight",
    image: "images/book5.jpg",
    link: "About this book",
    desciption:
      "A memoir by Nike's co-founder. The early struggles, risks, and hustle behind building a global brand from selling shoes out of a car trunk."
  }
]

var uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bookstore"

mongoose
  .connect(uri)
  .then(async function () {
    await Book.deleteMany({})
    await Book.insertMany(books)
    console.log("Inserted " + books.length + " books into MongoDB")
    await mongoose.connection.close()
    process.exit(0)
  })
  .catch(function (err) {
    console.error(err)
    process.exit(1)
  })
