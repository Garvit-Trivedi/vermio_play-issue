const express = require("express");
const { signUp, signIn, deleteUser } = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken"); // Ensure the user is authenticated

const router = express.Router();

router.post("/signup", signUp); // Register a new user
router.post("/signin", signIn); // Log in an existing user
router.delete("/delete", verifyToken, deleteUser); // Only authenticated users can delete their account

module.exports = router;
