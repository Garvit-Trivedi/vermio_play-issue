const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  addToLibrary,
  removeFromLibrary,
  getUserLibrary,
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getFriendList,
  removeFriend,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/profile/:id", getUserProfile);
router.post("/library/add", authMiddleware, addToLibrary);
router.post("/library/remove", authMiddleware, removeFromLibrary);
router.get("/library/me", authMiddleware, getUserLibrary);
router.get("/query", authMiddleware, searchUsers);
router.post("/friend/request", authMiddleware, sendFriendRequest);
router.post("/friend/accept", authMiddleware, acceptFriendRequest);
router.post("/friend/decline", authMiddleware, declineFriendRequest);
router.get("/friends/me", authMiddleware, getFriendList);
router.post("/friend/remove", authMiddleware, removeFriend);

module.exports = router;
