var express = require("express")
var app = express()

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

app.get("/api/books", function (req, res) {
  res.json(books)
})

app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
var port = process.env.port || 3000;
app.listen(port,()=>{
console.log("App listening to: "+port)
})