var express = require("express")
var mongoose = require("mongoose")
var Book = require("./models/book")

var app = express()

var uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bookstore"

app.get("/api/books", function (req, res) {
  Book.find()
    .lean()
    .then(function (books) {
      res.json(books)
    })
    .catch(function (err) {
      res.status(500).json({ error: err.message })
    })
})

app.use(express.static(__dirname + "/public"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

var port = process.env.PORT || process.env.port || 3000

mongoose
  .connect(uri)
  .then(function () {
    app.listen(port, function () {
      console.log("App listening on " + port + " (MongoDB connected)")
    })
  })
  .catch(function (err) {
    console.error("MongoDB connection failed:", err)
    process.exit(1)
  })
