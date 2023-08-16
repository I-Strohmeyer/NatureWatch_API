const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const { createServer } = require("http");
const app = express();
const server = createServer(app);

// Check environment and load environment variables
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Group middleware imports
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Database Connection
mongoose.set("strictQuery", true);
(async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database.");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
})();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Routes
const auth = require("./auth.js")(app);
require("./passport");
app.use(express.static("public"));
const movieRouter = require("./routes/movies");
const userRouter = require("./routes/users");
app.use("/movies", movieRouter);
app.use("/users", userRouter);

// Setting the port
const port = process.env.PORT || 8080;
const host = "0.0.0.0";

// Start the server
/**
 * Runs the server on specified params
 * @param {number} port
 * @param {string} host
 */
server.listen(port, host, () => {
  console.log(`Listening on ${host}:${port}`);
});
