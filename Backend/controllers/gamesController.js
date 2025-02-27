const mongoose = require("mongoose");
const verifyToken = require("../middleware/verifyToken");

const Game = mongoose.connection.collection("games");
const Library = mongoose.connection.collection("library");

// 📌 **GET all games (limit 10)**
const getAllGames = async (req, res) => {
  try {
    const games = await Game.find({}, { projection: { _id: 1, name: 1, profilePic: 1, reviews: 1 } })
      .limit(10)
      .toArray();
    const transformedGames = games.map((game) => ({
      _id: game._id,
      name: game.name,
      profilePic: game.profilePic,
      firstVideo: game.reviews?.find((r) => r.type === "video")?.url || null,
    }));
    res.status(200).json(transformedGames);
  } catch (error) {
    console.error("❌ Error fetching games:", error);
    res.status(500).json({ error: "Failed to fetch games. Please try again." });
  }
};

// 📌 **GET search games by name, genre, titles, developer**
const searchGames = async (req, res) => {
  try {
    const searchQuery = req.query.q;
    if (!searchQuery) {
      return res.status(400).json({ error: "Search query is required." });
    }
    const query = {
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { genres: { $regex: searchQuery, $options: "i" } },
        { titles: { $regex: searchQuery, $options: "i" } },
        { developer: { $regex: searchQuery, $options: "i" } },
      ],
    };
    const games = await Game.find(query, { projection: { _id: 1, name: 1, profilePic: 1, reviews: 1 } }).toArray();
    if (games.length === 0) {
      return res.status(404).json({ message: "No games found." });
    }
    res.status(200).json(games);
  } catch (error) {
    console.error("❌ Error searching games:", error);
    res.status(500).json({ error: "Failed to search games. Please try again." });
  }
};

// 📌 **GET game details by ID**
const getGameById = async (req, res) => {
  try {
    const game = await Game.findOne({ _id: parseInt(req.params.id) });
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
    res.status(200).json(game);
  } catch (error) {
    console.error("❌ Error fetching game:", error);
    res.status(500).json({ error: "Failed to fetch game. Please try again later." });
  }
};

// 📌 **POST add a game to the user's library**
// 📌 **POST add a game to the user's library**
const addGameToLibrary = async (req, res) => {
  try {
    const userId = req.user.id; // Ensure verifyToken middleware is used
    const { gameId } = req.body;

    if (!gameId) {
      return res.status(400).json({ error: "Game ID is required." });
    }

    // Find the game in the games collection
    const game = await Game.findOne({ _id: parseInt(gameId) });
    if (!game) {
      return res.status(404).json({ error: "Game not found." });
    }

    // Check if the game already exists in the user's library
    const existingGame = await Library.findOne({ _id: game._id, userId });
    if (existingGame) {
      return res.status(400).json({ error: "Game is already in your library." });
    }

    // Insert into the user's library
    await Library.insertOne({
      _id: game._id,
      userId,
      name: game.name,
      profilePic: game.profilePic,
      firstVideo: game.reviews?.find((r) => r.type === "video")?.url || null,
      addedAt: new Date(),
    });

    res.status(201).json({ message: "Game added to library.", game });
  } catch (error) {
    console.error("Error adding game to library:", error);
    res.status(500).json({ error: "Failed to add game. Please try again." });
  }
};

// 📌 **GET all games from the user's library**
const getLibraryGames = async (req, res) => {
  try {
    const userId = req.user.id;
    const savedGames = await Library.find({ userId }).toArray();
    res.status(200).json(savedGames);
  } catch (error) {
    console.error("Error fetching library games:", error);
    res.status(500).json({ error: "Failed to fetch library games." });
  }
};

// 📌 **DELETE remove game from the user's library**
const removeGameFromLibrary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { gameId } = req.params;
    const result = await Library.deleteOne({ _id: parseInt(gameId), userId });
    if (!result.deletedCount) {
      return res.status(404).json({ error: "Game not found in the library." });
    }
    res.status(200).json({ message: "Game removed from library." });
  } catch (error) {
    console.error("Error removing game from library:", error);
    res.status(500).json({ error: "Failed to remove game. Please try again." });
  }
};

module.exports = {
  getAllGames,
  searchGames,
  getGameById,
  addGameToLibrary,
  getLibraryGames,
  removeGameFromLibrary,
};
