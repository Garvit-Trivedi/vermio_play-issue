const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signup = async (req, res) => {
  const {
    first_name,
    last_name,
    display_name,
    email_id,
    date_of_birth,
    password,
  } = req.body;
  try {
    const existingUser = await User.findOne({
      $or: [{ email_id }, { display_name }],
    });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      first_name,
      last_name,
      display_name,
      email_id,
      date_of_birth,
      password: hashedPassword,
      library: [],
    });
    await user.save();

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res
      .status(201)
      .json({ token, user: { _id: user._id, display_name, email_id } });
  } catch (err) {
    console.error("Error in signup:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const signin = async (req, res) => {
  const { email_id, password } = req.body;
  try {
    const user = await User.findOne({ email_id });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      token,
      user: { _id: user._id, display_name: user.display_name, email_id },
    });
  } catch (err) {
    console.error("Error in signin:", err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { signup, signin };
