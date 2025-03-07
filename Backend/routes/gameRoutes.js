const express = require("express");
const router = express.Router();
const {
  getAllGames,
  getGameById,
  likeGame,
  addComment,
  likeComment,
  replyToComment,
  deleteComment,
  deleteReply,
  likeReply, // New import
} = require("../controllers/gameController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", getAllGames);
router.get("/:id", getGameById);
router.post("/:id/like", authMiddleware, likeGame);
router.post("/:id/comments", authMiddleware, addComment);
router.post("/:id/comments/:commentId/like", authMiddleware, likeComment);
router.post("/:id/comments/:commentId/reply", authMiddleware, replyToComment);
router.delete("/:id/comments/:commentId", authMiddleware, deleteComment);
router.delete(
  "/:id/comments/:commentId/reply/:replyId",
  authMiddleware,
  deleteReply
);
router.post(
  "/:id/comments/:commentId/reply/:replyId/like",
  authMiddleware,
  likeReply
); // New route

module.exports = router;
