const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const keys = require("../config/keys");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).send({ error: "Email already in use" });

    const user = new User({ name, email, password });
    await user.save();
    const token = jwt.sign({ id: user._id }, keys.jwtSecret);
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(500).send({ error: "Registration failed" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).send({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, keys.jwtSecret);
    res.send({ user, token });
  } catch (err) {
    res.status(500).send({ error: "Login failed" });
  }
};

const googleCallback = async (req, res) => {
  try {
    const { googleId, name, email, profilePicture } = req.user;

    console.log("userEmail", email);

    if (!email) {
      return res.status(400).send("Google profile does not contain an email");
    }

    let user = await User.findOne({ googleId: googleId });
    if (!user) {
      user = new User({
        googleId: googleId,
        name: name,
        email,
        profilePicture,
      });
    } else {
      user.name = name;
      user.email = email;
      user.profilePhoto = profilePicture;
    }
    await user.save();

    const token = jwt.sign({ id: user._id }, keys.jwtSecret, {
      expiresIn: "1h",
    });

    res.json({ token, user });
  } catch (error) {
    console.error("Error handling Google callback:", error);
    res.status(500).send("Error handling Google callback");
  }
};

module.exports = { register, login, googleCallback };
