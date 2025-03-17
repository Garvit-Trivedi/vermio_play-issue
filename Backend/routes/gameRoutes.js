
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getAllGames,
  getGameById,
  likeGame,
  rateGame,
  getRatingsDistribution,
  addComment,
  likeComment,
  replyToComment,
  deleteComment,
  deleteReply,
  likeReply,
} = require("../controllers/gameController");

// Get all games or search games
router.get("/", getAllGames);

// Get a specific game by ID
router.get("/:id", getGameById);

// Like or unlike a game
router.post("/:id/like", authMiddleware, likeGame);

// Rate a game
router.post("/:id/rate", authMiddleware, rateGame);

// Get ratings distribution for a game
router.get("/:id/ratings-distribution", getRatingsDistribution);

// Add a comment to a game
router.post("/:id/comments", authMiddleware, addComment);

// Like or unlike a comment
router.post("/:id/comments/:commentId/like", authMiddleware, likeComment);

// Reply to a comment
router.post("/:id/comments/:commentId/reply", authMiddleware, replyToComment);

// Delete a comment
router.delete("/:id/comments/:commentId", authMiddleware, deleteComment);

// Delete a reply
router.delete(
  "/:id/comments/:commentId/replies/:replyId",
  authMiddleware,
  deleteReply
);

// Like or unlike a reply
router.post(
  "/:id/comments/:commentId/replies/:replyId/like",
  authMiddleware,
  likeReply
);

module.exports = router;