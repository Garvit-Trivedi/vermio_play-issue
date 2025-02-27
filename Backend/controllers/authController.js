const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { generateToken } = require("../utils/jwt");

const signUp = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      display_name,
      email_id,
      date_of_birth,
      password,
    } = req.body;

    const userExists = await User.findOne({ email_id });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      first_name,
      last_name,
      display_name,
      email_id,
      date_of_birth,
      password: hashedPassword,
    });

    const token = generateToken(newUser);
    console.log("Generated Token (SignUp):", token); // Debugging

    res
      .status(201)
      .json({
        token,
        user: { id: newUser._id, display_name: newUser.display_name },
      });
  } catch (error) {
    console.error("SignUp Error:", error); // Debugging
    res.status(500).json({ message: "Error signing up", error });
  }
};

const signIn = async (req, res) => {
  try {
    const { email_id, password } = req.body;

    const user = await User.findOne({ email_id });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(user);
    console.log("Generated Token (SignIn):", token); // Debugging

    res
      .status(200)
      .json({ token, user: { id: user._id, display_name: user.display_name } });
  } catch (error) {
    console.error("SignIn Error:", error); // Debugging
    res.status(500).json({ message: "Error signing in", error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id; // Use both cases
    console.log("🔹 User ID from Token:", userId);

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

module.exports = { signUp, signIn, deleteUser };
