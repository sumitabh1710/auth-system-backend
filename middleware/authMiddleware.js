const jwt = require("jsonwebtoken");
const User = require("../models/User");
const keys = require("../config/keys");

const authenticate = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) return res.status(401).send({ error: "Please authenticate" });

  try {
    const decoded = jwt.verify(token, keys.jwtSecret);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

const authorizeAdmin = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) return res.status(401).send({ error: "Please authenticate" });

  try {
    const decoded = jwt.verify(token, keys.jwtSecret);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error();
    req.user = user;
    if (req.user.role !== "admin")
      return res.status(403).send({ error: "Access denied" });
    next();
  } catch (err) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = { authenticate, authorizeAdmin };
