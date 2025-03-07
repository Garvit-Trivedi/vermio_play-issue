const Game = require("../models/Game");
const User = require("../models/User");

const getAllGames = async (req, res) => {
  try {
    const { q, category } = req.query;

    if (category) {
      const games = await Game.find({
        category: { $regex: category, $options: "i" },
      });
      return res.json(games);
    }

    if (q) {
      const games = await Game.find({
        $or: [
          { name: { $regex: q, $options: "i" } },
          { genres: { $regex: q, $options: "i" } },
          { titles: { $regex: q, $options: "i" } },
          { developer: { $regex: q, $options: "i" } },
        ],
      });
      return res.json(games);
    }

    const games = await Game.find();
    res.json(games);
  } catch (err) {
    console.error("Error in getAllGames:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const getGameById = async (req, res) => {
  try {
    const gameId = Number(req.params.id);
    if (isNaN(gameId))
      return res
        .status(400)
        .json({ message: "Invalid game ID - must be a number" });

    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ message: "Game not found" });

    res.json(game);
  } catch (err) {
    console.error("Error in getGameById:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const likeGame = async (req, res) => {
  try {
    const gameId = Number(req.params.id);
    if (isNaN(gameId))
      return res.status(400).json({ message: "Invalid game ID" });

    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ message: "Game not found" });

    if (!game.likes.includes(req.user._id)) {
      game.likes.push(req.user._id);
      await game.save();
    }
    res.json({ message: "Game liked", likes: game.likes });
  } catch (err) {
    console.error("Error in likeGame:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const addComment = async (req, res) => {
  try {
    const gameId = Number(req.params.id);
    const { commentText } = req.body;
    if (isNaN(gameId))
      return res.status(400).json({ message: "Invalid game ID" });
    if (!commentText)
      return res.status(400).json({ message: "Comment text is required" });

    const [game, user] = await Promise.all([
      Game.findById(gameId),
      User.findById(req.user._id),
    ]);
    if (!game) return res.status(404).json({ message: "Game not found" });

    game.comments.push({
      email_id: user.email_id, // Updated
      displayName: user.display_name,
      commentText,
      time: new Date(),
      likes: [],
    });
    await game.save();
    res.json({ message: "Comment added", comments: game.comments });
  } catch (err) {
    console.error("Error in addComment:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const likeComment = async (req, res) => {
  try {
    const gameId = Number(req.params.id);
    const { commentId } = req.params;
    if (isNaN(gameId))
      return res.status(400).json({ message: "Invalid game ID" });

    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ message: "Game not found" });

    const comment = game.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (!comment.likes.includes(req.user._id)) {
      comment.likes.push(req.user._id);
      await game.save();
    }
    res.json({ message: "Comment liked", likes: comment.likes });
  } catch (err) {
    console.error("Error in likeComment:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const replyToComment = async (req, res) => {
  try {
    const gameId = Number(req.params.id);
    const { commentId } = req.params;
    const { commentText } = req.body;
    if (isNaN(gameId))
      return res.status(400).json({ message: "Invalid game ID" });
    if (!commentText)
      return res.status(400).json({ message: "Reply text is required" });

    const [game, user] = await Promise.all([
      Game.findById(gameId),
      User.findById(req.user._id),
    ]);
    if (!game) return res.status(404).json({ message: "Game not found" });

    const comment = game.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.replies = comment.replies || [];
    comment.replies.push({
      email_id: user.email_id, // Updated
      displayName: user.display_name,
      commentText,
      time: new Date(),
      likes: [],
    });
    await game.save();
    res.json({ message: "Reply added", replies: comment.replies });
  } catch (err) {
    console.error("Error in replyToComment:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const gameId = Number(req.params.id);
    const { commentId } = req.params;
    if (isNaN(gameId))
      return res.status(400).json({ message: "Invalid game ID" });

    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ message: "Game not found" });

    const comment = game.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.email_id !== req.user.email_id) {
      // Updated
      return res
        .status(403)
        .json({ message: "You can only delete your own comments" });
    }

    game.comments.pull({ _id: commentId });
    await game.save();
    res.json({ message: "Comment deleted", comments: game.comments });
  } catch (err) {
    console.error("Error in deleteComment:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const deleteReply = async (req, res) => {
  try {
    const gameId = Number(req.params.id);
    const { commentId, replyId } = req.params;
    if (isNaN(gameId))
      return res.status(400).json({ message: "Invalid game ID" });

    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ message: "Game not found" });

    const comment = game.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const reply = comment.replies.id(replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    if (reply.email_id !== req.user.email_id) {
      // Updated
      return res
        .status(403)
        .json({ message: "You can only delete your own replies" });
    }

    comment.replies.pull({ _id: replyId });
    await game.save();
    res.json({ message: "Reply deleted", replies: comment.replies });
  } catch (err) {
    console.error("Error in deleteReply:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const likeReply = async (req, res) => {
  try {
    const gameId = Number(req.params.id);
    const { commentId, replyId } = req.params;
    if (isNaN(gameId))
      return res.status(400).json({ message: "Invalid game ID" });

    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ message: "Game not found" });

    const comment = game.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const reply = comment.replies.id(replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    if (!reply.likes.includes(req.user._id)) {
      reply.likes.push(req.user._id);
      await game.save();
    }
    res.json({ message: "Reply liked", likes: reply.likes });
  } catch (err) {
    console.error("Error in likeReply:", err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllGames,
  getGameById,
  likeGame,
  addComment,
  likeComment,
  replyToComment,
  deleteComment,
  deleteReply,
  likeReply,
};
