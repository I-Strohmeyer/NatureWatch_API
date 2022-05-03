const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Models = require("./models.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
app.get("/movies", (req, res) => {
  Movies.find().then((err, movies) => {
    if (err) {
      res.send(err);
    } else {
      res.send(movies);
    }
  });
});

// Return data (description, genre, director, image URL, whether it’s featured or not)
// about a single movie by title to the user
app.get("/movies/:_id", (req, res) => {
  Movies.findById({ _id: req.params._id })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

/* app.get("/movies/:id/details", (req, res) => {
  res.send("Successful GET request returning details on a single movie");
}); */

// Return data about a genre (description) by name/title (e.g., “Thriller”) to the user
app.get("/movies/genre/:name", (req, res) => {
  Movies.findOne({ "Genre.Name": req.params.name })
    .then((movie) => {
      res.json(movie.Genre.Description);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

/* app.get("/movies/search/:query", (req, res) => {
  res.send(
    "Successful GET request returning a list of movies that match the query"
  );
}); */

// Return data about a director (bio, birth year, death year) by name
app.get("/movies/directors/:name", (req, res) => {
  Movies.findOne({ "Director.Name": req.params.name })
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Allow users to add a movie to their list of favorites
app.post("/users/:user_id/watchlist/:movie_id", (req, res) => {
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
});

// Allow new users to register
app.post("/users/register", (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + " " + "already exists");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
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
});

// Allow users to update their user info (username, password, email, date of birth)
app.put("/users/:user_id", (req, res) => {
  Users.findByIdAndUpdate(
    { _id: req.params.user_id },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
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
});

// Allow users to remove a movie from their list of favorites
app.delete("/users/:user_id/watchlist/:movie_id", (req, res) => {
  Users.findByIdAndUpdate(
    { _id: req.params.user_id },
    { $pull: { FavoriteMovies: req.params.movie_id } },
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
});

// Allow existing users to deregister
app.delete("/users/:user_id", (req, res) => {
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
});

app.use(express.static("public"));

// log requests to server in the terminal
app.use(morgan("common"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
  next();
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
