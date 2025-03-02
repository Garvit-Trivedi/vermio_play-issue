const Game = require("../models/Game");
const User = require("../models/User");
const formatNumbers = require("../utils/formatNumbers");

const getAllGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.json(
      games.map((game) => ({
        ...game._doc,
        likes: {
          count: game.likes.length,
          formatted: formatNumbers(game.likes.length),
        },
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getGameById = async (req, res) => {
  try {
    const gameId = Number(req.params.id); // Convert string to number
    const game = await Game.findOne({ _id: gameId });
    if (!game) return res.status(404).json({ message: "Game not found" });
    res.json({
      ...game._doc,
      likes: {
        count: game.likes.length,
        formatted: formatNumbers(game.likes.length),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const likeGame = async (req, res) => {
  try {
    const gameId = Number(req.params.id);
    const game = await Game.findOne({ _id: gameId });
    if (!game) return res.status(404).json({ message: "Game not found" });

    const userId = req.user._id.toString();
    if (game.likes.includes(userId)) {
      game.likes = game.likes.filter((id) => id !== userId); // Unlike
    } else {
      game.likes.push(userId); // Like
    }
    await game.save();

    res.json({
      likes: {
        count: game.likes.length,
        formatted: formatNumbers(game.likes.length),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addComment = async (req, res) => {
  try {
    const gameId = Number(req.params.id);
    const game = await Game.findOne({ _id: gameId });
    if (!game) return res.status(404).json({ message: "Game not found" });

    const { commentText } = req.body;
    if (!commentText)
      return res.status(400).json({ message: "Comment text is required" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newComment = {
      userId: req.user._id.toString(),
      displayName: user.display_name,
      commentText,
      time: new Date(),
      likes: [],
      replies: [],
    };

    game.comments.push(newComment);
    game.markModified("comments"); // Explicitly mark comments as modified
    await game.save();

    const savedComment = game.comments[game.comments.length - 1];
    console.log("Saved game document:", game.toObject()); // Debug log
    res.status(201).json(savedComment);
  } catch (err) {
    console.error("Error saving comment:", err); // Log any errors
    res.status(500).json({ message: err.message });
  }
};

const likeComment = async (req, res) => {
  try {
    const gameId = Number(req.params.id);
    const game = await Game.findOne({ _id: gameId });
    if (!game) return res.status(404).json({ message: "Game not found" });

    const comment = game.comments.find(
      (c) => c.commentId === req.params.commentId
    );
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const userId = req.user._id.toString();
    if (comment.likes.includes(userId)) {
      comment.likes = comment.likes.filter((id) => id !== userId); // Unlike
    } else {
      comment.likes.push(userId); // Like
    }

    await game.save();
    res.json({
      likes: {
        count: comment.likes.length,
        formatted: formatNumbers(comment.likes.length),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const replyToComment = async (req, res) => {
  try {
    const gameId = Number(req.params.id);
    const game = await Game.findOne({ _id: gameId });
    if (!game) return res.status(404).json({ message: "Game not found" });

    const comment = game.comments.find(
      (c) => c.commentId === req.params.commentId
    );
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const { commentText } = req.body;
    if (!commentText)
      return res.status(400).json({ message: "Reply text is required" });

    const user = await User.findById(req.user._id);
    const newReply = {
      userId: req.user._id.toString(),
      displayName: user.display_name,
      commentText,
      time: new Date(),
    };

    comment.replies.push(newReply);
    await game.save();

    res.status(201).json(newReply);
  } catch (err) {
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
};
