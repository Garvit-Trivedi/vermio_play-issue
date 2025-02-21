import React, { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { searchGames } from "../services/api";
import { useNavigate } from "react-router-dom";
import GamerLoader from "./GameLoader"; // Import loader

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isSearchOpen, setSearchOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 0) {
            setLoading(true); // Show loader
            const searchResults = await searchGames(value);
            setResults(searchResults);
            setLoading(false); // Hide loader
        } else {
            setResults([]);
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
        <div className="relative flex justify-center items-center w-full">
            {/* Search Button / Input */}
            <div
                className={`fixed top-2 transition-all duration-300 ease-in-out flex items-center ${isSearchOpen
                        ? "left-1/2 transform -translate-x-1/2 w-[400px] bg-gray-800 p-2 rounded-full"
                        : "left-50 w-[40px] h-[40px] rounded-full flex items-center justify-center"
                    }`}
            >
                {!isSearchOpen ? (
                    <button onClick={() => setSearchOpen(true)}>
                        <FaSearch className="text-white text-lg" />
                    </button>
                ) : (
                    <div className="flex items-center w-full">
                        <FaSearch className="text-white text-lg ml-2" />
                        <input
                            type="text"
                            placeholder="Search games..."
                            value={query}
                            onChange={handleSearch}
                            className="w-full bg-transparent text-white outline-none p-2 mx-2"
                            autoFocus
                        />
                        <button onClick={handleCancel} className="text-white text-lg mr-2">
                            <FaTimes />
                        </button>
                    </div>
                )}
            </div>

            {/* Search Results Dropdown (Centered) */}
            {isSearchOpen && (loading || results.length > 0) && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 p-4 transition-all duration-300 rounded-xl w-[500px] shadow-lg max-h-80 overflow-y-auto border-4">
                    {loading ? (
                        <GamerLoader /> // Show loader when fetching
                    ) : (
                        results.map((game) => (
                            <GameCard key={game._id} game={game} onClick={() => handleGameClick(game._id)} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

const GameCard = ({ game, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative flex items-center space-x-3 p-3 border-b border-t border-gray-700 transition-all duration-300 cursor-pointer hover:bg-gray-800 rounded-2xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            {/* Show Image by Default, Video on Hover */}
            {isHovered ? (
                <video src={game.firstVideo} autoPlay loop muted className="w-55 h-30 transition-all duration-300 object-cover border-2 rounded-lg" />
            ) : (
                <img src={game.profilePic} alt={game.name} className="w-50 h-25 transition-all duration-300 rounded-lg" />
            )}

            <span className={`text-white ${isHovered ? "font-extrabold" : ""}`}>{game.name}</span>
        </div>
    );
};

export default SearchBar;
