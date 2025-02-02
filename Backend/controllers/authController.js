// const { getUserCollection } = require("../config/db");
// const bcrypt = require("bcryptjs"); // Ensure bcryptjs is installed
// const jwt = require("jsonwebtoken"); // Ensure jsonwebtoken is installed

// const signIn = async (req, res) => {
//   const { email_id, password } = req.body;

//   try {
//     const userCollection = await getUserCollection();

//     const user = await userCollection.findOne({ email_id });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     return res.status(200).json({ token });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// const signUp = async (req, res) => {
//   const {
//     first_name,
//     last_name,
//     display_name,
//     email_id,
//     date_of_birth,
//     password,
//   } = req.body;

//   try {
//     const userCollection = await getUserCollection();

//     const existingUser = await userCollection.findOne({ email_id });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = {
//       first_name,
//       last_name,
//       display_name,
//       email_id,
//       date_of_birth,
//       password: hashedPassword,
//     };

//     await userCollection.insertOne(newUser);
//     return res.status(201).json({ message: "User created successfully" });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = { signIn, signUp };

const { getUserCollection } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 📌 **SignIn function**
const signIn = async (req, res) => {
  const { email_id, password } = req.body;

  try {
    const userCollection = await getUserCollection();

    const user = await userCollection.findOne({ email_id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email_id: user.email_id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Remove password before sending response
    const { password: _, ...userData } = user;

    return res.status(200).json({ token, user: userData });
  } catch (err) {
    console.error("Error in signIn:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// 📌 **SignUp function**
const signUp = async (req, res) => {
  const {
    first_name,
    last_name,
    display_name,
    email_id,
    date_of_birth,
    password,
  } = req.body;

  try {
    const userCollection = await getUserCollection();

    const existingUser = await userCollection.findOne({ email_id });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a numeric _id based on count (if required)
    const userCount = await userCollection.countDocuments();
    const newUser = {
      _id: userCount + 1, // Generates a unique numerical ID
      first_name,
      last_name,
      display_name,
      email_id,
      date_of_birth,
      password: hashedPassword,
    };

    await userCollection.insertOne(newUser);
    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error in signUp:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  const userId = req.user._id; // Extract user ID from the token

  try {
    const userCollection = await getUserCollection(); // Await the DB connection

    // Delete the user from the database
    const result = await userCollection.deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signIn, signUp, deleteUser };
