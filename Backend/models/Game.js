const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    _id: { type: Number, required: true },
    name: { type: String, required: true },
    profilePic: String,
    bgPic: String,
    titles: [String],
    genres: [String],
    developer: String,
    description: String,
    about: String, // Added
    reviews: [
      {
        type: { type: String, enum: ["video", "text", "image"] },
        url: String,
        thumbnail: { type: String, required: true }, // Make required
      },
    ],
    likes: [{ type: String }],
    comments: [
      {
        commentId: {
          type: String,
          default: () => new mongoose.Types.ObjectId().toString(),
        },
        userId: { type: String },
        displayName: { type: String },
        commentText: { type: String, required: true },
        time: { type: Date, default: Date.now },
        likes: [String],
        replies: [
          {
            userId: { type: String },
            displayName: { type: String },
            commentText: { type: String, required: true },
            time: { type: Date, default: Date.now },
          },
        ],
      },
    ],
  },
  { timestamps: true, _id: false }
);

module.exports = mongoose.model("Game", gameSchema);
