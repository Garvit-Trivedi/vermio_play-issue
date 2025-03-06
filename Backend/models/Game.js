const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  displayName: String,
  commentText: String,
  time: { type: Date, default: Date.now },
});

const commentSchema = new mongoose.Schema({
  displayName: String,
  commentText: String,
  time: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  replies: [replySchema],
});

const reviewSchema = new mongoose.Schema({
  type: { type: String, enum: ["image", "video", "text"], required: true },
  url: { type: String, required: true },
  displayName: String,
  time: { type: Date, default: Date.now },
});

const gameSchema = new mongoose.Schema(
  {
    _id: { type: Number, required: true },
    name: { type: String, required: true },
    profilePic: { type: String, required: true },
    bgPic: { type: String },
    titles: [String],
    reviews: [reviewSchema],
    description: { type: String },
    developer: { type: String },
    genres: [String],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
    updatedAt: { type: Date, default: Date.now },
  },
  { versionKey: "__v" }
);

gameSchema.index({ name: "text", titles: "text", genres: "text" });

module.exports = mongoose.model("Game", gameSchema);
