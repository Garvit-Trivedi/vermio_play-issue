const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    display_name: { type: String, unique: true, required: true },
    email_id: { type: String, unique: true, required: true },
    date_of_birth: { type: Date, required: true },
    password: { type: String, required: true },
    library: [{ type: Number }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of friend IDs
    friendRequests: [
      {
        // Pending friend requests
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: {
          type: String,
          enum: ["pending", "accepted", "declined"],
          default: "pending",
        },
      },
    ],
    libraryPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
