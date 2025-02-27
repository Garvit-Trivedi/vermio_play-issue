const express = require("express");
const {
  getAllGames,
  searchGames,
  getGameById,
  addGameToLibrary,
  getLibraryGames,
  removeGameFromLibrary,
} = require("../controllers/gamesController");
const authMiddleware = require("../middleware/verifyToken");

const router = express.Router();

// Define routes
router.get("/games", getAllGames);
router.get("/games/search", searchGames);
router.get("/games/:id", getGameById);

// Protected routes (require authentication)
router.post("/library", authMiddleware, addGameToLibrary);
router.get("/library", authMiddleware, getLibraryGames);
router.delete("/library/:gameId", authMiddleware, removeGameFromLibrary);

module.exports = router;
