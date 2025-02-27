const express = require("express");
const { signUp, signIn, deleteUser } = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken"); // Ensure this is correctly imported

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.delete("/delete", verifyToken, deleteUser); // ✅ Protected Route

module.exports = router;
