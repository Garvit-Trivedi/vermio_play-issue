import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FaTimes, FaUserPlus, FaTrash, FaCheck, FaTimesCircle, FaPlusCircle, FaUserFriends, FaEnvelope, FaPaperPlane, FaHourglassHalf } from "react-icons/fa";
import { searchUsers, sendFriendRequest, acceptFriendRequest, declineFriendRequest, getFriendList, removeFriend } from "../services/api";
import { toast } from "react-toastify";

const FriendsSidebar = ({ isOpen, onClose, sidebarRef }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [isSearchFocused, setSearchFocused] = useState(false);
  const [activeTab, setActiveTab] = useState("friends");

  useEffect(() => {
    if (!isOpen) return;
    const loadFriends = async () => {
      try {
        const data = await getFriendList();
        const friendIds = new Set(data.friends.map(f => f._id));
        setFriends(data.friends);
        setRequests(data.friendRequests);
        // Filter out sent requests that are already friends
        setSentRequests(data.sentFriendRequests.filter(sr => !friendIds.has(sr.userId)) || []);
      } catch (error) {
        toast.error(error.message || "Failed to load friends");
      }
    };
    loadFriends();
  }, [isOpen]);

  useEffect(() => {
    if (!isSearchFocused) return;
    const fetchSuggestions = async () => {
      try {
        const suggestionData = await searchUsers(query, 10);
        setSuggestions(suggestionData.filter(user =>
          user && user._id && !friends.some(f => f._id === user._id) && !sentRequests.some(sr => sr.userId === user._id)
        ));
      } catch (error) {
        toast.error(error.message || "Failed to fetch suggestions");
      }
    };
    fetchSuggestions();
  }, [isSearchFocused, query, friends, sentRequests]);

  const handleSendRequest = useCallback(async (userId) => {
    if (!userId) return toast.error("Cannot send request: User ID is missing");
    try {
      await sendFriendRequest(userId);
      toast.success("Friend request sent", { toastId: `send-${userId}` });
      const updatedData = await getFriendList();
      const friendIds = new Set(updatedData.friends.map(f => f._id));
      setSentRequests(updatedData.sentFriendRequests.filter(sr => !friendIds.has(sr.userId)) || []);
      setSuggestions(prev => prev.filter(s => s._id !== userId));
    } catch (error) {
      toast.error(error.message || "Failed to send request", { toastId: `error-${userId}` });
    }
  }, []);

  const handleAccept = useCallback(async (userId) => {
    try {
      await acceptFriendRequest(userId);
      toast.success("Friend request accepted", { toastId: `accept-${userId}` });
      const updatedData = await getFriendList();
      const friendIds = new Set(updatedData.friends.map(f => f._id));
      setFriends(updatedData.friends);
      setRequests(updatedData.friendRequests);
      setSentRequests(updatedData.sentFriendRequests.filter(sr => !friendIds.has(sr.userId)) || []);
    } catch (error) {
      toast.error(error.message || "Failed to accept request", { toastId: `error-${userId}` });
    }
  }, []);

  const handleDecline = useCallback(async (userId) => {
    try {
      await declineFriendRequest(userId);
      toast.success("Friend request declined", { toastId: `decline-${userId}` });
      const updatedData = await getFriendList();
      const friendIds = new Set(updatedData.friends.map(f => f._id));
      setRequests(updatedData.friendRequests);
      setSentRequests(updatedData.sentFriendRequests.filter(sr => !friendIds.has(sr.userId)) || []);
    } catch (error) {
      toast.error(error.message || "Failed to decline request", { toastId: `error-${userId}` });
    }
  }, []);

  const handleRemoveFriend = useCallback(async (friendId) => {
    try {
      await removeFriend(friendId);
      toast.success("Friend removed", { toastId: `remove-${friendId}` });
      const updatedData = await getFriendList();
      const friendIds = new Set(updatedData.friends.map(f => f._id));
      setFriends(updatedData.friends);
      setSentRequests(updatedData.sentFriendRequests.filter(sr => !friendIds.has(sr.userId)) || []);
    } catch (error) {
      toast.error(error.message || "Failed to remove friend", { toastId: `error-${friendId}` });
    }
  }, []);

  const handleCancelSearch = useCallback(() => {
    setQuery("");
    setSearchFocused(false);
  }, []);

  const suggestionList = useMemo(() => (
    suggestions.length > 0 ? (
      suggestions.map((user) => (
        <div
          key={user._id}
          className="flex justify-between items-center p-2 hover:bg-gray-700 group"
        >
          {user.display_name}
          <button
            onClick={() => handleSendRequest(user._id)}
            className="z-10 bg-slate-800 border-2 border-cyan-300 text-white p-1 sm:p-2 rounded-lg hover:border-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FaUserPlus size={16} />
          </button>
        </div>
      ))
    ) : (
      <p className="p-2 text-center text-sm">No suggestions</p>
    )
  ), [suggestions, handleSendRequest]);

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-gray-900 text-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-lg sm:text-xl font-bold">Friends</h2>
        <button onClick={onClose} className="text-white hover:text-red-400">
          <FaTimes size={20} />
        </button>
      </div>

      <div className="p-4 flex flex-col h-full">
        <div className="mb-4 relative">
          <div className="flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search friends..."
              className="w-full p-2 bg-gray-800 rounded text-white outline-none text-sm sm:text-base"
            />
            {isSearchFocused && (
              <button
                onClick={handleCancelSearch}
                className="absolute right-2 text-gray-400 hover:text-red-400"
              >
                <FaTimes size={14} />
              </button>
            )}
          </div>
          {isSearchFocused && (
            <div className="absolute top-12 left-0 right-0 bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
              {suggestionList}
            </div>
          )}
        </div>

        <div className="flex border-b border-gray-700 mb-4">
          <button
            onClick={() => setActiveTab("friends")}
            className={`flex-1 p-2 flex justify-center items-center ${activeTab === "friends" ? "bg-gray-800 border-b-2 border-cyan-300" : "hover:bg-gray-800"}`}
          >
            <FaUserFriends size={20} />
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 p-2 flex justify-center items-center ${activeTab === "requests" ? "bg-gray-800 border-b-2 border-cyan-300" : "hover:bg-gray-800"}`}
          >
            <FaEnvelope size={20} />
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            className={`flex-1 p-2 flex justify-center items-center ${activeTab === "sent" ? "bg-gray-800 border-b-2 border-cyan-300" : "hover:bg-gray-800"}`}
          >
            <FaPaperPlane size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === "friends" && (
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">My Friends</h3>
              {friends.length > 0 ? (
                <ul className="space-y-2">
                  {friends.map((friend) => (
                    <li
                      key={friend._id}
                      className="flex justify-between items-center p-2 bg-gray-800 rounded group text-sm sm:text-base"
                    >
                      {friend.display_name}
                      <div className="flex gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleRemoveFriend(friend._id)}
                          className="z-10 bg-slate-800 border-2 border-pink-400 text-white p-1 sm:p-2 rounded-lg hover:border-purple-400"
                        >
                          <FaTrash size={14} />
                        </button>
                        <button
                          onClick={() => {/* Add to lobby logic later */ }}
                          className="z-10 bg-slate-800 border-2 border-cyan-300 text-white p-1 sm:p-2 rounded-lg hover:border-purple-400"
                        >
                          <FaPlusCircle size={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs sm:text-sm">No friends yet</p>
              )}
            </div>
          )}

          {activeTab === "requests" && (
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">Friend Requests</h3>
              {requests.length > 0 ? (
                <ul className="space-y-2">
                  {requests.map((req) => (
                    <li
                      key={req.userId}
                      className="flex justify-between items-center p-2 bg-gray-800 rounded text-sm sm:text-base"
                    >
                      {req.display_name || req.userId}
                      <div className="flex gap-1 sm:gap-2">
                        <button
                          onClick={() => handleAccept(req.userId)}
                          className="z-10 bg-slate-800 border-2 border-cyan-300 text-white p-1 sm:p-2 rounded-lg hover:border-purple-400"
                        >
                          <FaCheck size={14} />
                        </button>
                        <button
                          onClick={() => handleDecline(req.userId)}
                          className="z-10 bg-slate-800 border-2 border-pink-400 text-white p-1 sm:p-2 rounded-lg hover:border-purple-400"
                        >
                          <FaTimesCircle size={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs sm:text-sm">No pending requests</p>
              )}
            </div>
          )}

          {activeTab === "sent" && (
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">Sent Requests</h3>
              {sentRequests.length > 0 ? (
                <ul className="space-y-2">
                  {sentRequests.map((req) => (
                    <li
                      key={req.userId}
                      className="flex justify-between items-center p-2 bg-gray-800 rounded text-sm sm:text-base"
                    >
                      {req.display_name || req.userId}
                      <FaHourglassHalf className="text-gray-400" size={14} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs sm:text-sm">No sent requests</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsSidebar;