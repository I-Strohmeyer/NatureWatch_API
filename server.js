// checks environment
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Cross-Origin Resource Sharing
const cors = require("cors");
app.use(cors());

const auth = require("./auth.js")(app);
const passport = require("passport");
require("./passport");

// Database Connection
// Use of environment variable
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// basic ENDPOINT
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const movieRouter = require("./routes/movies");
const userRouter = require("./routes/users");

/**
 * Static content  in public folder for the app
 */
app.use(express.static("public"));

// log requests to server in the terminal
app.use(morgan("common"));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
  next();
});

// Routes
app.use("/movies", movieRouter);
app.use("/users", userRouter);

// Setting the port
const port = process.env.PORT || 8080;

/**
 * Runs the server on specified params
 * @param {number} port
 * @param {string} host
 */
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
