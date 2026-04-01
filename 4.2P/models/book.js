var mongoose = require("mongoose")

var bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  image: String,
  link: String,
  desciption: String
})

module.exports = mongoose.model("Book", bookSchema)
