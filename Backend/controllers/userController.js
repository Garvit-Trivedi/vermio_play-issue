const User = require("../models/User");
const Game = require("../models/Game");
const mongoose = require("mongoose");

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error in getUserProfile:", err.message);
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

    const [game, user] = await Promise.all([
      Game.findOne({ _id: gameId }),
      User.findById(req.user._id),
    ]);
    if (!game) return res.status(404).json({ message: "Game not found" });
    if (user.library.includes(gameId))
      return res.status(400).json({ message: "Game already in library" });

    user.library.push(gameId);
    await user.save();
    res.json({ message: "Game added to library", library: user.library });
  } catch (err) {
    console.error("Error in addToLibrary:", err.message);
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
    if (!user.library.includes(gameId))
      return res.status(400).json({ message: "Game not in library" });

    user.library = user.library.filter((id) => id !== gameId);
    await user.save();
    res.json({ message: "Game removed from library", library: user.library });
  } catch (err) {
    console.error("Error in removeFromLibrary:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const getUserLibrary = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const games = await Game.find({ _id: { $in: user.library } });
    res.json(games);
  } catch (err) {
    console.error("Error in getUserLibrary:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { q = "", limit = 15 } = req.query;
    const currentUserId = req.user._id;

    const users = await User.aggregate([
      {
        $match: {
          $or: [
            { display_name: { $regex: q, $options: "i" } },
            { first_name: { $regex: q, $options: "i" } },
          ],
        },
      },
      { $sample: { size: parseInt(limit) + 1 } },
      { $project: { display_name: 1, first_name: 1, last_name: 1 } },
    ])
      .then((results) =>
        results.filter(
          (user) => user._id.toString() !== currentUserId.toString()
        )
      )
      .then((filtered) => filtered.slice(0, parseInt(limit)));

    res.json(users);
  } catch (err) {
    console.error("Error in searchUsers:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const sendFriendRequest = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Authentication required" });

    const { userId } = req.body;
    if (!userId)
      return res.status(400).json({ message: "User ID is required" });
    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ message: "Invalid user ID format" });
    if (userId === req.user._id.toString())
      return res
        .status(400)
        .json({ message: "Cannot send request to yourself" });

    const [targetUser, currentUser] = await Promise.all([
      User.findById(userId),
      User.findById(req.user._id),
    ]);
    if (!targetUser) return res.status(404).json({ message: "User not found" });
    if (!currentUser)
      return res.status(404).json({ message: "Current user not found" });

    if (
      targetUser.friendRequests.some(
        (request) => request.userId.toString() === req.user._id.toString()
      )
    ) {
      return res.status(400).json({ message: "Friend request already sent" });
    }
    if (currentUser.friends.includes(userId))
      return res.status(400).json({ message: "User is already a friend" });

    targetUser.friendRequests.push({ userId: req.user._id });
    currentUser.sentFriendRequests = currentUser.sentFriendRequests || [];
    if (!currentUser.sentFriendRequests.includes(userId))
      currentUser.sentFriendRequests.push(userId);

    await Promise.all([targetUser.save(), currentUser.save()]);
    res.status(201).json({ message: "Friend request sent" });
  } catch (err) {
    console.error("Error in sendFriendRequest:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId)
      return res.status(400).json({ message: "User ID is required" });

    const [currentUser, friendUser] = await Promise.all([
      User.findById(req.user._id),
      User.findById(userId),
    ]);
    const request = currentUser.friendRequests.find(
      (req) => req.userId.toString() === userId
    );
    if (!request || request.status !== "pending")
      return res
        .status(400)
        .json({ message: "No pending friend request found" });
    if (!friendUser) return res.status(404).json({ message: "User not found" });

    // Add each other to friends list
    currentUser.friends.push(userId);
    friendUser.friends.push(req.user._id);

    // Remove the accepted request from currentUser's friendRequests
    currentUser.friendRequests = currentUser.friendRequests.filter(
      (req) => req.userId.toString() !== userId
    );

    // Remove userId from friendUser's sentFriendRequests (John's request to Jane)
    friendUser.sentFriendRequests = friendUser.sentFriendRequests.filter(
      (id) => id.toString() !== req.user._id.toString()
    );

    // Edge case: Remove req.user._id from currentUser's sentFriendRequests if it exists (Jane sent to John too)
    currentUser.sentFriendRequests = currentUser.sentFriendRequests.filter(
      (id) => id.toString() !== userId
    );

    await Promise.all([currentUser.save(), friendUser.save()]);
    res.json({ message: "Friend request accepted" });
  } catch (err) {
    console.error("Error in acceptFriendRequest:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const declineFriendRequest = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId)
      return res.status(400).json({ message: "User ID is required" });

    const currentUser = await User.findById(req.user._id);
    const request = currentUser.friendRequests.find(
      (req) => req.userId.toString() === userId
    );
    if (!request || request.status !== "pending")
      return res
        .status(400)
        .json({ message: "No pending friend request found" });

    currentUser.friendRequests = currentUser.friendRequests.filter(
      (req) => req.userId.toString() !== userId
    );
    await currentUser.save();
    res.json({ message: "Friend request declined" });
  } catch (err) {
    console.error("Error in declineFriendRequest:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const getFriendList = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("friends", "display_name first_name last_name")
      .populate("friendRequests.userId", "display_name first_name last_name")
      .populate("sentFriendRequests", "display_name first_name last_name");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      friends: user.friends,
      friendRequests: user.friendRequests.map((req) => ({
        userId: req.userId._id,
        display_name: req.userId.display_name,
      })),
      sentFriendRequests: user.sentFriendRequests.map((id) => ({
        userId: id._id,
        display_name: id.display_name,
      })),
    });
  } catch (err) {
    console.error("Error in getFriendList:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    if (!friendId)
      return res.status(400).json({ message: "Friend ID is required" });

    const [currentUser, friendUser] = await Promise.all([
      User.findById(req.user._id),
      User.findById(friendId),
    ]);
    if (!friendUser)
      return res.status(404).json({ message: "Friend not found" });
    if (!currentUser.friends.includes(friendId))
      return res
        .status(400)
        .json({ message: "User is not in your friend list" });

    currentUser.friends = currentUser.friends.filter(
      (id) => id.toString() !== friendId
    );
    friendUser.friends = friendUser.friends.filter(
      (id) => id.toString() !== req.user._id.toString()
    );

    await Promise.all([currentUser.save(), friendUser.save()]);
    res.json({ message: "Friend removed successfully" });
  } catch (err) {
    console.error("Error in removeFriend:", err.message);
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
  removeFriend,
};
