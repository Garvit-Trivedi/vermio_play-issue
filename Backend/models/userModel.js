const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  display_name: { type: String, required: true },
  email_id: { type: String, required: true, unique: true },
  date_of_birth: { type: Date, required: true },
  password: { type: String, required: true }, // Hashed password
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
