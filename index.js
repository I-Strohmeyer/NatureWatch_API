const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Models = require("./models.js");
const { check, validationResult } = require("express-validator");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require("cors");
app.use(cors());

const auth = require("./auth.js")(app);
const passport = require("passport");
require("./passport");

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect("mongodb://localhost:27017/Naturewatch", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/* ENDPOINTS */
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Return a list of ALL movies to the user
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find().then((err, movies) => {
      if (err) {
        res.send(err);
      } else {
        res.send(movies);
      }
    });
  }
);

// Return data (description, genre, director, image URL, whether it’s featured or not)
// about a single movie by title to the user
app.get(
  "/movies/:_id",
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

/* app.get("/movies/:id/details", (req, res) => {
  res.send("Successful GET request returning details on a single movie");
}); */

// Return data about a genre (description) by name/title (e.g., “Thriller”) to the user
app.get(
  "/movies/genre/:name",
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

/* app.get("/movies/search/:query", (req, res) => {
  res.send(
    "Successful GET request returning a list of movies that match the query"
  );
}); */

// Return data about a director (bio, birth year, death year) by name
app.get(
  "/movies/directors/:name",
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

// Allow users to add a movie to their list of favorites
app.post(
  "/users/:user_id/watchlist/:movie_id",
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

// Allow new users to register
app.post(
  "/users/register",
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

// Allow users to update their user info (username, password, email, date of birth)
app.put(
  "/users/:user_id",
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

// Allow users to remove a movie from their list of favorites
app.delete(
  "/users/:user_id/watchlist/:movie_id",
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

// Allow existing users to deregister
app.delete(
  "/users/:user_id",
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

app.use(express.static("public"));

// log requests to server in the terminal
app.use(morgan("common"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
  next();
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
