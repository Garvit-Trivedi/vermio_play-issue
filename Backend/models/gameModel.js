const { getGameCollection } = require("../config/db");

class Game {
  constructor(
    _id,
    name,
    titles,
    reviews,
    description,
    about,
    developer,
    genres
  ) {
    this._id = _id; // Ensure _id follows the expected numerical format
    this.name = name;
    this.titles = titles || [];
    this.reviews = reviews || []; // Array of images/videos
    this.description = description || "";
    this.about = about || "";
    this.developer = developer || "";
    this.genres = genres || [];
  }
}

// Export a function to get the games collection dynamically
module.exports = { getGameCollection, Game };
