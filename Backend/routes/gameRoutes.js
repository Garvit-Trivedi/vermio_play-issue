const express = require("express");
const {
  getAllGames,
  getGameById,
  likeGame,
  addComment,
  likeComment,
  replyToComment,
} = require("../controllers/gameController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", getAllGames);
router.get("/:id", getGameById);
router.post("/:id/like", authMiddleware, likeGame);
router.post("/:id/comments", authMiddleware, addComment);
router.post("/:id/comments/:commentId/like", authMiddleware, likeComment);
router.post("/:id/comments/:commentId/reply", authMiddleware, replyToComment);

module.exports = router;
