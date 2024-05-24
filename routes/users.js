const express = require("express");
const {
  getProfile,
  updateProfile,
  listPublicProfiles,
  listPrivateProfiles,
  viewProfile,
} = require("../controllers/userController");
const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", authenticate, getProfile);
router.patch("/me", authenticate, updateProfile);
router.get("/public", listPublicProfiles);
router.get("/private", authorizeAdmin, listPrivateProfiles);
router.get("/:id", authenticate, viewProfile);

module.exports = router;
