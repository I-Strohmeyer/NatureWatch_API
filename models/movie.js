const mongoose = require("mongoose");

let movieSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Genre: {
    Name: String,
    Description: String,
  },
  Year: Number,
  Director: {
    Name: String,
    Bio: String,
    Birth: String,
    Death: String,
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean,
});

let Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
