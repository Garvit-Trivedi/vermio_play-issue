const { ObjectId } = require("mongodb");
const { gamesCollection } = require("../config/db");

class Game {
  constructor(name, titles, reviews, description, about, developer, genres) {
    this._id = new ObjectId();
    this.name = name;
    this.titles = titles || [];
    this.reviews = reviews || []; // Array of images/videos
    this.description = description || "";
    this.about = about || "";
    this.developer = developer || "";
    this.genres = genres || [];
  }
}

module.exports = { gamesCollection, Game };
