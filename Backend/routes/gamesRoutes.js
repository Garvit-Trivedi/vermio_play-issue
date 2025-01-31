const express = require("express");
const {
  getAllGames,
  searchGames,
  getGameById,
  addGameToLibrary,
  getLibraryGames,
  removeGameFromLibrary,
} = require("../controllers/gamesController");

const router = express.Router();

// Define routes
router.get("/games", getAllGames);
router.get("/games/search", searchGames);
router.get("/games/:id", getGameById);
router.post("/library", addGameToLibrary);
router.get("/library", getLibraryGames);
router.delete("/library/:id", removeGameFromLibrary);

module.exports = router;
