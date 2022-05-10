const jwtSecret = "some_secret"; // needs to be the same key as in the strategy
const jwt = require("jsonwebtoken");
const passport = require("passport"); // local passport file

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // this is the username that is encoded in the JWT
    expiresIn: "7d",
    algorithm: "HS256",
  });
};

/* POST /login */
module.exports = (router) => {
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: "Something is not right(login)",
          user: user,
        });
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
