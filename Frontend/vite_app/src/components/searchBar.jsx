import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { searchGames } from "../services/api";
import { useNavigate } from "react-router-dom";
import GameLoader from "./GameLoader";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length >= 1) {
        handleSearch();
      } else {
        setResults([]);
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const searchResults = await searchGames(query);
      setResults(searchResults || []);
    } catch (error) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSearchOpen(false);
    setQuery("");
    setResults([]);
    setLoading(false);
  };

  const handleGameClick = (gameId) => {
    navigate(`/game/${gameId}`);
    handleCancel();
  };

  return (
    <div className="relative flex items-center">
      <div
        className={`flex items-center transition-all duration-300 ease-in-out ${
          isSearchOpen
            ? "w-full sm:w-[450px] border-b-2 border-cyan-600 p- rounded-full"
            : "w-10 h-10 rounded-full flex items-center justify-center"
        }`}
      >
        {!isSearchOpen ? (
          <button onClick={() => setSearchOpen(true)}>
            <FaSearch className="text-white text-lg" />
          </button>
        ) : (
          <div className="flex items-center w-full">
            <FaSearch className="text-white text-sm sm:text-lg ml-2" />
            <input
              type="text"
              placeholder="Search games..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-white outline-none p-1 sm:p-2 mx-1 sm:mx-2 text-sm sm:text-base"
              autoFocus
            />
            <button
              onClick={handleCancel}
              className="text-white text-sm sm:text-lg mr-2"
            >
              <FaTimes />
            </button>
          </div>
        )}
      </div>

      {isSearchOpen && (
        <div
          className={`absolute top-12 left-0 bg-gray-900 p-2 sm:p-4 rounded-xl w-full sm:w-[450px] shadow-lg overflow-y-auto border-4 border-gray-700 transition-all duration-300 ${
            loading
              ? "h-40 sm:h-52"
              : results.length > 0 || query.length > 0
              ? "max-h-60 sm:max-h-80"
              : "h-0 opacity-0"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <GameLoader isFullPage={false} />
            </div>
          ) : results.length > 0 ? (
            results.map((game) => (
              <GameCard
                key={game._id}
                game={game}
                query={query}
                onClick={() => handleGameClick(game._id)}
              />
            ))
          ) : query.length > 0 ? (
            <p className="text-white text-center text-xs sm:text-sm">
              No results found
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
};

const GameCard = ({ game, query, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getMatchedField = () => {
    const lowerQuery = query.toLowerCase();
    if (game.name.toLowerCase().includes(lowerQuery)) return game.name;
    const matchedTitle = game.titles.find(title => title.toLowerCase().includes(lowerQuery));
    if (matchedTitle) return matchedTitle;
    const matchedGenre = game.genres.find(genre => genre.toLowerCase().includes(lowerQuery));
    if (matchedGenre) return matchedGenre;
    const matchedDeveloper = game.developer.toLowerCase().includes(lowerQuery) ? game.developer : null;
    return matchedDeveloper || game.name;
  };

  const highlightMatch = (text) => {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="text-cyan-400">$1</span>');
  };

  const displayText = highlightMatch(getMatchedField());

  return (
    <div
      className="flex items-center space-x-2 my-1 sm:space-x-3 p-2 sm:p-3 border-b border-t border-gray-700 transition-all duration-300 cursor-pointer hover:bg-gray-800 rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {isHovered && game.reviews.find((r) => r.type === "video")?.url ? (
        <video
          src={game.reviews.find((r) => r.type === "video").url}
          autoPlay
          loop
          muted
          className="w-12 h-8 sm:w-30 sm:h-17 object-cover rounded-lg border-2"
        />
      ) : (
        <img
          src={game.profilePic}
          alt={game.name}
          className="w-12 h-8 sm:w-30 sm:h-17 object-cover rounded-lg"
        />
      )}
      <span
        className={`text-white text-xs sm:text-sm ${isHovered ? "font-bold" : ""}`}>{game.name}</span>
    </div>
  );
};

export default SearchBar;