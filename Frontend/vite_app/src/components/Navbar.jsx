import React, { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./tailwind.css";
import { FaUser } from "react-icons/fa";
import { TfiAlignRight } from "react-icons/tfi";
import SearchBar from "./searchBar"; // Import new SearchBar component

function Navbar() {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const profileRef = useRef(null);

  const closeAllOverlays = () => {
    setProfileOpen(false);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar flex items-center justify-between px-4 py-2 bg-gray-800 text-white fixed w-full z-1000">
      {/* Left Side: Logo, Name, Search */}
      <div className="flex items-center space-x-4">
        <Link to="/home">
          <img
            src="https://res.cloudinary.com/dp5upogbb/image/upload/v1738649003/po2fjar6stgbf9gajstf.webp"
            alt="Logo"
            className="w-30 h-10 cursor-pointer rounded"
          />
        </Link>
        <Link to="/home">
          <h1 className="text-xl w-max font-bold">VerMio Play</h1>
        </Link>
        {/* Integrated Search Component */}
        <SearchBar />
      </div>

      {/* Right Side: Menu, Profile */}
      <div className="flex items-center space-x-4">
        {/* Menu Expands to Left Side */}
        <div className={`relative flex transition-all duration-500 ${isMenuOpen ? "bg-gray-900 py-1 px-3 rounded-3xl" : ""}`}>
          {isMenuOpen ? (
            <div className="flex items-center">
              <button onClick={() => setMenuOpen(!isMenuOpen)} className="focus:outline-none rotate-90 transition-all duration-300">
                <TfiAlignRight className="text-2xl cursor-pointer text-white" />
              </button>
              <div className="ml-3 mt-1">
                <ul className="flex space-x-6">
                  {["/home", "/discover", "/categories"].map((path) => (
                    <li key={path} className="relative">
                      <Link
                        to={path}
                        onClick={closeAllOverlays}
                        className={`relative text-white hover:text-blue-300 transition-colors pb-1 ${location.pathname === path ? "text-blue-500 font-bold" : ""
                          }`}
                      >
                        {path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                        {location.pathname === path && (
                          <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 rounded-full transition-all duration-300"></span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <button onClick={() => setMenuOpen(!isMenuOpen)} className="focus:outline-none">
              <TfiAlignRight className="text-2xl cursor-pointer" />
            </button>
          )}
        </div>

        {/* Profile Button with Dropdown Animation */}
        <div className="relative" ref={profileRef}>
          <button onClick={() => setProfileOpen(!isProfileOpen)} className="focus:outline-none">
            <FaUser className="text-2xl cursor-pointer" />
          </button>

          {/* Profile Menu with Slide & Fade Animation */}
          <div
            className={`absolute right-0 top-12 bg-gray-900 text-white p-4 rounded-lg shadow-lg w-40 z-20 transform transition-all duration-300 ${isProfileOpen ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 -translate-y-3 pointer-events-none"
              }`}
          >
            <ul className="space-y-3">
              {["/profile", "/library", "/subscription"].map((path) => (
                <li key={path} className="relative">
                  <Link
                    to={path}
                    onClick={closeAllOverlays}
                    className={`relative text-white hover:text-blue-300 transition-colors pb-1 ${location.pathname === path ? "text-blue-500 font-bold" : ""
                      }`}
                  >
                    {path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                    {location.pathname === path && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500 transition-all duration-300"></span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
