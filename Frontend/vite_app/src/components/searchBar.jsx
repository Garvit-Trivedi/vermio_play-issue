import React, { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { searchGames } from "../services/api"; // Import API

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isSearchOpen, setSearchOpen] = useState(false);

    const handleSearch = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 0) {
            const searchResults = await searchGames(value);
            setResults(searchResults);
        } else {
            setResults([]);
        }
    };

    const handleCancel = () => {
        setSearchOpen(false);
        setQuery("");
        setResults([]);
    };

    return (
        <div className="relative flex justify-center  items-center w-full">
            {/* Search Button / Input */}
            <div
                className={`fixed top-2 transition-all duration-300 ease-in-out flex items-center ${isSearchOpen
                        ? "left-1/2 transform -translate-x-1/2 w-[400px] bg-gray-800 p-2 rounded-full"
                        : "left-50 right-10 w-[40px] h-[40px]  rounded-full flex items-center justify-center"
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

            {/* Search Results Dropdown */}
            {isSearchOpen && results.length > 0 && (
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 p-4 rounded-xl w-[400px] shadow-lg max-h-72 overflow-y-auto">
                    {results.map((game) => (
                        <GameCard key={game.gameId} game={game} />
                    ))}
                </div>
            )}
        </div>
    );
};

const GameCard = ({ game }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`relative flex items-center space-x-3 p-3 border-b border-gray-700 transition-all duration-300 cursor-pointer ${isHovered ? "w-[450px] h-[250px]" : "w-full"
                }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Show Image by Default, Video on Hover */}
            {isHovered ? (
                <video src={game.firstVideo} autoPlay loop muted className="w-full h-full rounded-lg" />
            ) : (
                <img src={game.profilePic} alt={game.name} className="w-16 h-16 rounded-lg" />
            )}

            <span className="text-white">{game.name}</span>
        </div>
    );
};

export default SearchBar;
