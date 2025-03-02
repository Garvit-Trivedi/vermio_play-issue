const express = require("express");
const {
  getUserProfile,
  addToLibrary,
  removeFromLibrary,
  getUserLibrary,
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest, // New
  declineFriendRequest, // New
  getFriendList, // New
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Specific routes first
router.get("/search", authMiddleware, searchUsers);
router.post("/friend/request", authMiddleware, sendFriendRequest);
router.post("/friend/accept", authMiddleware, acceptFriendRequest); // New
router.post("/friend/decline", authMiddleware, declineFriendRequest); // New
router.get("/friends/me", authMiddleware, getFriendList); // New
router.post("/library/add", authMiddleware, addToLibrary);
router.post("/library/remove", authMiddleware, removeFromLibrary);
router.get("/library/me", authMiddleware, getUserLibrary);

// Catch-all :id route last
router.get("/:id", authMiddleware, getUserProfile);

module.exports = router;
