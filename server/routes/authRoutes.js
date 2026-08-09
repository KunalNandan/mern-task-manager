const express = require("express");

const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
  } = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected profile routes
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;