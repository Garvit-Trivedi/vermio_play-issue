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

// const express = require("express");
// const verifyToken = require("../middleware/verifyToken"); // Import the middleware
// const {
//   getAllGames,
//   searchGames,
//   getGameById,
//   addGameToLibrary,
//   getLibraryGames,
//   removeGameFromLibrary,
// } = require("../controllers/gamesController");

// const router = express.Router();

// // Define public routes (no authentication required)
// router.get("/games", getAllGames);
// router.get("/games/search", searchGames);
// router.get("/games/:id", getGameById);

// // Define protected routes (authentication required)
// router.post("/library", verifyToken, addGameToLibrary); // Protected: Add game to library
// router.get("/library", verifyToken, getLibraryGames); // Protected: Get user's library
// router.delete("/library/:id", verifyToken, removeGameFromLibrary); // Protected: Remove game from library

// module.exports = router;
