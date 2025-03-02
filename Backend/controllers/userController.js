const User = require("../models/User");
const Game = require("../models/Game");

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addToLibrary = async (req, res) => {
  try {
    const { gameId } = req.body;
    if (!gameId || typeof gameId !== "number")
      return res
        .status(400)
        .json({ message: "Valid game ID (number) is required" });

    const game = await Game.findOne({ _id: gameId });
    if (!game) return res.status(404).json({ message: "Game not found" });

    const user = await User.findById(req.user._id);
    if (user.library.includes(gameId)) {
      return res.status(400).json({ message: "Game already in library" });
    }

    user.library.push(gameId);
    await user.save();

    res.json({ message: "Game added to library", library: user.library });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeFromLibrary = async (req, res) => {
  try {
    const { gameId } = req.body;
    if (!gameId || typeof gameId !== "number")
      return res
        .status(400)
        .json({ message: "Valid game ID (number) is required" });

    const user = await User.findById(req.user._id);
    if (!user.library.includes(gameId)) {
      return res.status(400).json({ message: "Game not in library" });
    }

    user.library = user.library.filter((id) => id !== gameId);
    await user.save();

    res.json({ message: "Game removed from library", library: user.library });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserLibrary = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const games = await Game.find({
      _id: { $in: user.library },
    }).select("name profilePic");

    res.json(games);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q)
      return res.status(400).json({ message: "Search query is required" });

    const users = await User.find({
      $or: [
        { display_name: { $regex: q, $options: "i" } },
        { first_name: { $regex: q, $options: "i" } },
      ],
    }).select("display_name first_name last_name");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const sendFriendRequest = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId)
      return res.status(400).json({ message: "User ID is required" });
    if (userId === req.user._id.toString())
      return res
        .status(400)
        .json({ message: "Cannot send request to yourself" });

    const targetUser = await User.findById(userId);
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    const currentUser = await User.findById(req.user._id);
    if (
      targetUser.friendRequests.some(
        (req) => req.userId.toString() === req.user._id.toString()
      )
    ) {
      return res.status(400).json({ message: "Friend request already sent" });
    }
    if (currentUser.friends.includes(userId)) {
      return res.status(400).json({ message: "User is already a friend" });
    }

    targetUser.friendRequests.push({ userId: req.user._id });
    await targetUser.save();

    res.status(201).json({ message: "Friend request sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const { userId } = req.body; // ID of the user whose request is being accepted
    if (!userId)
      return res.status(400).json({ message: "User ID is required" });

    const currentUser = await User.findById(req.user._id);
    const request = currentUser.friendRequests.find(
      (req) => req.userId.toString() === userId
    );
    if (!request || request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "No pending friend request found" });
    }

    const friendUser = await User.findById(userId);
    if (!friendUser) return res.status(404).json({ message: "User not found" });

    // Update both users' friends lists
    currentUser.friends.push(userId);
    friendUser.friends.push(req.user._id);

    // Remove the request from currentUser's friendRequests
    currentUser.friendRequests = currentUser.friendRequests.filter(
      (req) => req.userId.toString() !== userId
    );

    await currentUser.save();
    await friendUser.save();

    res.json({ message: "Friend request accepted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const declineFriendRequest = async (req, res) => {
  try {
    const { userId } = req.body; // ID of the user whose request is being declined
    if (!userId)
      return res.status(400).json({ message: "User ID is required" });

    const currentUser = await User.findById(req.user._id);
    const request = currentUser.friendRequests.find(
      (req) => req.userId.toString() === userId
    );
    if (!request || request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "No pending friend request found" });
    }

    // Update status to declined or remove it
    currentUser.friendRequests = currentUser.friendRequests.filter(
      (req) => req.userId.toString() !== userId
    );

    await currentUser.save();

    res.json({ message: "Friend request declined" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFriendList = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "friends",
      "display_name first_name last_name"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getUserProfile,
  addToLibrary,
  removeFromLibrary,
  getUserLibrary,
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getFriendList,
};
