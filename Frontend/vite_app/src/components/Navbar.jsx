import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './tailwind.css';

function Navbar() {
  // Manage states for the Profile, Menu, and Search overlays
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);

  // Helper function to close all overlays
  const closeAllOverlays = () => {
    setProfileOpen(false);
    setMenuOpen(false);
    setSearchOpen(false);
  };

  // Toggle Profile overlay and close others
  const toggleProfile = () => {
    if (isProfileOpen) {
      setProfileOpen(false); // Close if already open
    } else {
      closeAllOverlays(); // Close all and open profile
      setProfileOpen(true);
    }
  };

  // Toggle Menu overlay and close others
  const toggleMenu = () => {
    if (isMenuOpen) {
      setMenuOpen(false); // Close if already open
    } else {
      closeAllOverlays(); // Close all and open menu
      setMenuOpen(true);
    }
  };

  // Toggle Search input and close others
  const toggleSearch = () => {
    if (isSearchOpen) {
      setSearchOpen(false); // Close if already open
    } else {
      closeAllOverlays(); // Close all and open search input
      setSearchOpen(true);
    }
  };

  return (
    <nav className="navbar flex items-center justify-between px-4 py-2 bg-gray-800 text-white relative z-10">
      {/* Left side: Logo, Name, Search Button */}
      <div className="flex items-center space-x-4">
        {/* Logo with clickable link */}
        <Link to="/home">
          <img
            src="https://res.cloudinary.com/dp5upogbb/image/upload/v1738649003/po2fjar6stgbf9gajstf.webp"
            alt="Logo"
            className="w-10 h-10 cursor-pointer rounded" // Add cursor pointer to indicate it's clickable
          />
        </Link>
        <h1 className="text-xl font-bold">VerMio Play</h1>

        {/* Search Button with Hover Effect */}
        <div className="relative">
          <button
            onClick={toggleSearch}
            className="focus:outline-none"
          >
            <i className="fas fa-search text-2xl cursor-pointer">s</i>
          </button>
          {isSearchOpen && (
            <input
              type="text"
              placeholder="Search..."
              className="absolute left-0 top-0 mt-2 w-48 px-2 py-1 rounded border border-gray-500"
            />
          )}
        </div>
      </div>

      {/* Middle space */}
      <div></div>

      {/* Right side: Profile Button, Menu Button */}
      <div className="flex items-center space-x-4">
        {/* Profile Button */}
        <div className="relative">
          <button onClick={toggleProfile} className="focus:outline-none">
            <i className="fas fa-user-circle text-2xl">p</i>
          </button>

          {/* Profile Menu Overlay */}
          {isProfileOpen && (
            <div className="absolute right-0 bg-white text-black p-4 rounded shadow-lg mt-2 w-40 z-20">
              <ul>
                <li className="mb-2">
                  <Link to="/profile">Username</Link>
                </li>
                <li className="mb-2">
                  <Link to="/library">Library</Link>
                </li>
                <li className="mb-2">
                  <Link to="/subscription">Subscription</Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Menu Button with Click to Open/Close */}
        <div className="relative">
          <button
            onClick={toggleMenu} // Toggle the menu visibility on click
            className="focus:outline-none"
          >
            <i className="fas fa-bars text-2xl">m</i>
          </button>

          {/* Menu Items */}
          {isMenuOpen && (
            <div className="absolute right-0 bg-white text-black p-4 rounded shadow-lg mt-2 w-40 z-20">
              <ul>
                <li className="mb-2">
                  <Link to="/home" onClick={() => setMenuOpen(false)}>Home</Link>
                </li>
                <li className="mb-2">
                  <Link to="/discover" onClick={() => setMenuOpen(false)}>Discover</Link>
                </li>
                <li className="mb-2">
                  <Link to="/categories" onClick={() => setMenuOpen(false)}>Categories</Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
