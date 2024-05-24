const User = require("../models/User");
const bcrypt = require("bcryptjs");

const getProfile = async (req, res) => {
  res.send(req.user);
};

const updateProfile = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "bio",
    "phone",
    "email",
    "password",
    "profilePicture",
    "isPublic",
  ];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) return res.status(400).send({ error: "Invalid updates" });

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    if (req.body.password)
      req.user.password = await bcrypt.hash(req.body.password, 10);
    await req.user.save();
    res.send(req.user);
  } catch (err) {
    res.status(500).send({ error: "Update failed" });
  }
};

const listPublicProfiles = async (req, res) => {
  try {
    const users = await User.find({ isPublic: true });
    res.send(users);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch public profiles" });
  }
};

const listPrivateProfiles = async (req, res) => {
  try {
    const users = await User.find({ isPublic: false });
    res.send(users);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch public profiles" });
  }
};

const viewProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).send({ error: "User not found" });

    if (
      user.isPublic ||
      req.user.role === "admin" ||
      req.user._id.equals(user._id)
    ) {
      res.send(user);
    } else {
      res.status(403).send({ error: "Access denied" });
    }
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch profile" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  listPublicProfiles,
  listPrivateProfiles,
  viewProfile,
};
