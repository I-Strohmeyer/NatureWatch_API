const express = require("express");
const router = express.Router();
const passport = require("passport");
require("../passport");

const Movies = require("../models/movie");

/**
 * Return a list of ALL movies to the user
 * @requires passport
 * @returns {Object[]} movies
 */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //(req, res) => {
    Movies.find().then((err, movies) => {
      if (err) {
        res.send(err);
      } else {
        res.send(movies);
      }
    });
  }
);

/**
 * Return data (description, genre, director, image URL, whether it’s featured or not)
 * about a single movie by title to the user
 * @requires passport
 * @param {string} id
 * @returns {Object} movie
 */
router.get(
  "/:_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findById({ _id: req.params._id })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Return data about a genre (description) by name/title (e.g., “Thriller”) to the user
 * @param {string} genre.name
 * @requires passport
 * @returns {Object} genre
 */
router.get(
  "/genre/:name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.name })
      .then((movie) => {
        res.json(movie.Genre.Description);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Return data about a director (bio, birth year, death year) by name
 * @param {string} director.name
 * @requires passport
 * @returns {Object} director
 */
router.get(
  "/directors/:name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Director.Name": req.params.name })
      .then((movie) => {
        res.json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

module.exports = router;
