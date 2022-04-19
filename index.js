const express = require("express");
const app = express();
const morgan = require("morgan");

const natureMovies = [
  {
    id: 1,
    title: "Free Solo",
    year: 2018,
    director: "Elizabeth Chai Vasarhelyi",
  },
  {
    id: 2,
    title: "Earth",
    year: 2007,
    director: "Alastair Fothergill",
  },
  {
    id: 3,
    title: "Daughters of the Dust",
    year: 1991,
    director: "Julie Dash",
  },
  {
    id: 4,
    title: "The Tree of Life",
    year: 2011,
    director: "Terrence Malick",
  },
  {
    id: 5,
    title: "Whale Rider",
    year: 2002,
    director: "Niki Caro",
  },
  {
    id: 6,
    title: "Lawrence of Arabia",
    year: 1962,
    director: "David Lean",
  },
  {
    id: 7,
    title: "The Lord of the Rings",
    year: 2001,
    director: "Peter Jackson",
  },
  {
    id: 8,
    title: "Clouds of Sils Maria",
    year: 2014,
    director: "Olivier Assayas",
  },
  {
    id: 9,
    title: "Portrait of a Lady on Fire",
    year: 2019,
    director: "Céline Sciamma",
  },
  {
    id: 10,
    title: "Okja",
    year: 2017,
    director: "Bong Joon-ho",
  },
];

/* ENDPOINTS */
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/movies", (req, res) => {
  res.json(natureMovies);
});

app.get("/movies/:id", (req, res) => {
  res.send("Successful GET request returning data on a single movie");
});

app.get("/movies/:id/details", (req, res) => {
  res.send("Successful GET request returning details on a single movie");
});

app.get("/movies/search/:query", (req, res) => {
  res.send(
    "Successful GET request returning a list of movies that match the query"
  );
});

app.get("/movies/directors/:name", (req, res) => {
  res.send("Successful GET request returning information about a director");
});

app.post("/movies/:id/watchlist", (req, res) => {
  res.send("Successful post request to add a movie to a user's watchlist");
});

app.post("/users/register", (req, res) => {
  res.send("Successful post request to register a new user");
});

app.put("/users/:user_id", (req, res) => {
  res.send("Successful put request to update a user's information");
});

app.delete("/movies/:id/watchlist/:user_id", (req, res) => {
  res.send(
    "Successful delete request to remove a movie from a user's watchlist"
  );
});

app.delete("/users/:user_id", (req, res) => {
  res.send("Successful delete request to delete a user");
});

app.use(express.static("public"));

app.use(morgan("common"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
  next();
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
