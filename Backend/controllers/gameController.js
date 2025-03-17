
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
    const game = await Game.findOne({ _id: gameId });
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
    const game = await Game.findOne({ _id: gameId });
    if (!game) return res.status(404).json({ message: "Game not found" });

    const userId = req.user._id.toString();
    const hasLiked = game.likes.some((id) => id.toString() === userId);

    if (hasLiked) {
      game.likes = game.likes.filter((id) => id.toString() !== userId);
      await game.save();
      res.json({ message: "Like removed", likes: game.likes });
    } else {
      game.likes.push(req.user._id);
      await game.save();
      res.json({ message: "Game liked", likes: game.likes });
    }
  } catch (err) {
    console.error("Error in likeGame:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const rateGame = async (req, res) => {
  try {
    const { rating } = req.body;
    const gameId = Number(req.params.id);
    const userId = req.user._id;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const game = await Game.findOne({ _id: gameId });
    if (!game) return res.status(404).json({ message: "Game not found" });

    const existingRating = game.rating.find(
      (r) => r.userId.toString() === userId.toString()
    ); // Changed to game.rating
    if (existingRating) {
      existingRating.rating = rating;
    } else {
      game.rating.push({ userId, rating }); // Changed to game.rating
    }

    await game.save();
    res.json({ message: "Rating submitted", rating: game.rating }); // Changed to rating
  } catch (err) {
    console.error("Error in rateGame:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const getRatingsDistribution = async (req, res) => {
  try {
    const gameId = Number(req.params.id);
    const game = await Game.findOne({ _id: gameId });
    if (!game) return res.status(404).json({ message: "Game not found" });

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    game.rating.forEach((r) => {
      // Changed to game.rating
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    });

    res.json(distribution);
  } catch (err) {
    console.error("Error in getRatingsDistribution:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const addComment = async (req, res) => {
  try {
    const gameId = Number(req.params.id);
    const { commentText } = req.body;
    if (!commentText)
      return res.status(400).json({ message: "Comment text is required" });

    const [game, user] = await Promise.all([
      Game.findOne({ _id: gameId }),
      User.findById(req.user._id),
    ]);
    if (!game) return res.status(404).json({ message: "Game not found" });

    game.comments.push({
      email_id: user.email_id,
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
    const game = await Game.findOne({ _id: gameId });
    if (!game) return res.status(404).json({ message: "Game not found" });

    const comment = game.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const userId = req.user._id.toString();
    const hasLiked = comment.likes.some((id) => id.toString() === userId);

    if (hasLiked) {
      comment.likes = comment.likes.filter((id) => id.toString() !== userId);
      await game.save();
      res.json({ message: "Like removed from comment", likes: comment.likes });
    } else {
      comment.likes.push(req.user._id);
      await game.save();
      res.json({ message: "Comment liked", likes: comment.likes });
    }
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
    if (!commentText)
      return res.status(400).json({ message: "Reply text is required" });

    const [game, user] = await Promise.all([
      Game.findOne({ _id: gameId }),
      User.findById(req.user._id),
    ]);
    if (!game) return res.status(404).json({ message: "Game not found" });

    const comment = game.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.replies = comment.replies || [];
    comment.replies.push({
      email_id: user.email_id,
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
    const game = await Game.findOne({ _id: gameId });
    if (!game) return res.status(404).json({ message: "Game not found" });

    const comment = game.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.email_id !== req.user.email_id) {
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
    const game = await Game.findOne({ _id: gameId });
    if (!game) return res.status(404).json({ message: "Game not found" });

    const comment = game.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const reply = comment.replies.id(replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    if (reply.email_id !== req.user.email_id) {
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
    const game = await Game.findOne({ _id: gameId });
    if (!game) return res.status(404).json({ message: "Game not found" });

    const comment = game.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const replyDoc = comment.replies.id(replyId);
    if (!replyDoc) return res.status(404).json({ message: "Reply not found" });

    const userId = req.user._id.toString();
    const hasLiked = replyDoc.likes.some((id) => id.toString() === userId);

    if (hasLiked) {
      replyDoc.likes = replyDoc.likes.filter((id) => id.toString() !== userId);
      await game.save();
      res.json({ message: "Like removed from reply", likes: replyDoc.likes });
    } else {
      replyDoc.likes.push(req.user._id);
      await game.save();
      res.json({ message: "Reply liked", likes: replyDoc.likes });
    }
  } catch (err) {
    console.error("Error in likeReply:", err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
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
};