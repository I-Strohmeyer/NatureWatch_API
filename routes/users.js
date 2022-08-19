const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const passport = require("passport");
require("../passport");

const Users = require("../models/user");

/**
 * Allow users to add a movie to their list of favorites
 * @requires passport
 * @param {string} userid
 * @param {string} movieid
 */
router.post(
  "/:user_id/watchlist/:movie_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findByIdAndUpdate(
      { _id: req.params.user_id },
      { $addToSet: { FavoriteMovies: { _id: req.params.movie_id } } },
      { new: true }, // return the updated document
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * Get single user by id
 * @requires passport
 * @param {string} userid
 */
router.get(
  "/:user_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findById(req.params.user_id, (err, user) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(user);
      }
    });
  }
);

/**
 * Allow new users to register
 * @requires passport
 * @returns {Object} user
 */
router.post(
  "/register",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res
            .status(400)
            .send(req.body.Username + " " + "already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * Allow users to update their user info (username, password, email, date of birth)
 * @requires passport
 * @param {string} userid
 * @returns {Object} user
 */
router.put(
  "/:user_id",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findByIdAndUpdate(
      { _id: req.params.user_id },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }, // return the updated document
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * Allow users to remove a movie from their list of favorites
 * @requires passport
 * @param {string} userid
 * @param {string} movieid
 * @returns {Object} user
 */
router.delete(
  "/:user_id/watchlist/:movie_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findByIdAndUpdate(
      { _id: req.params.user_id },
      { $pull: { FavoriteMovies: { _id: req.params.movie_id } } },
      { new: true }, // return the updated document
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * Allow existing users to delete their account
 * @requires passport
 * @param {string} userid
 */
router.delete(
  "/:user_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findByIdAndRemove({ _id: req.params.user_id })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found");
        } else {
          res.status(200).send(req.params.Username + " was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

module.exports = router;
