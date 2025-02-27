const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  _id: Number, // Ensures _id follows the expected numerical format
  name: { type: String, required: true },
  titles: { type: [String], default: [] },
  reviews: { type: [Object], default: [] }, // Array of images/videos
  description: { type: String, default: "" },
  about: { type: String, default: "" },
  developer: { type: String, default: "" },
  genres: { type: [String], default: [] },
});

const Game = mongoose.model("Game", gameSchema, "games"); // Explicitly set the collection name to "games"

module.exports = Game;
