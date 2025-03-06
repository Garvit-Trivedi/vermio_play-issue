import React, { useState, useRef, useEffect, useContext, memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./tailwind.css";
import { FaUser, FaUserFriends, FaHome, FaCompass, FaList, FaBook, FaCreditCard, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import { TfiAlignRight } from "react-icons/tfi";
import SearchBar from "./searchBar";
import FriendsSidebar from "./FriendsSidebar";
import { AuthContext } from "../AuthContext";

const Navbar = memo(function Navbar() {
  const { authToken, setAuthToken } = useContext(AuthContext);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isCategoriesOpen, setCategoriesOpen] = useState(false);
  const [isFriendsOpen, setFriendsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const menuRef = useRef(null);
  const friendsSidebarRef = useRef(null);
  const categoriesRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
    navigate("/signin");
  };

  const closeAllOverlays = () => {
    setProfileOpen(false);
    setMenuOpen(false);
    setCategoriesOpen(false);
    setFriendsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (profileRef.current && !profileRef.current.contains(event.target)) &&
        (menuRef.current && !menuRef.current.contains(event.target)) &&
        (friendsSidebarRef.current && !friendsSidebarRef.current.contains(event.target)) &&
        (categoriesRef.current && !categoriesRef.current.contains(event.target))
      ) {
        closeAllOverlays();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigation styles configuration
  const navStyles = {
    common: `flex items-center justify-center block px-4 py-2 hover:border-y-2 hover:border-blue-500 transition-all rounded-full`,
    active: `border-y-2 border-blue-500`,
  };

  return (
    <nav className="flex items-center justify-between px-3 py-2 bg-gray-800 text-white fixed w-full z-50">
      {/* Left Side: Logo with Text, Search */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        <Link to="/home" onClick={closeAllOverlays}>
          <img
            src="https://res.cloudinary.com/dp5upogbb/image/upload/v1738649003/po2fjar6stgbf9gajstf.webp"
            alt="Logo"
            className="w-10 h-10 sm:w-12 sm:h-12 cursor-pointer rounded object-contain"
          />
        </Link>
        <Link to="/home" onClick={closeAllOverlays} className="flex items-center">
          <h1 className="text-lg sm:text-xl font-bold whitespace-nowrap">VerMio Play</h1>
        </Link>
        <div className="hidden sm:block">
          <SearchBar />
        </div>
      </div>

      {/* Right Side: Menu, Friends, Categories, Profile/Sign In */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Mobile Menu Button (Hidden on Desktop) */}
        <div ref={menuRef} className="sm:hidden">
          <button onClick={() => setMenuOpen(!isMenuOpen)} className="focus:outline-none">
            <TfiAlignRight className={`text-xl cursor-pointer transition-transform duration-300 ${isMenuOpen ? "rotate-90" : ""}`} />
          </button>
          {isMenuOpen && (
            <div className="absolute top-14 right-4 bg-gray-900 rounded-lg shadow-lg p-4 w-48 z-20">
              <ul className="flex flex-col space-y-2">
                <li>
                  <Link to="/home" onClick={closeAllOverlays} className={`${navStyles.common} ${location.pathname === "/home" ? navStyles.active : ""}`}>
                    <FaHome className="text-xl mr-3" />
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/discover" onClick={closeAllOverlays} className={`${navStyles.common} ${location.pathname === "/discover" ? navStyles.active : ""}`}>
                    <FaCompass className="text-xl mr-3" />
                    Discover
                  </Link>
                </li>
                <li>
                  <Link to="/categories/action" onClick={closeAllOverlays} className={`${navStyles.common} ${location.pathname === "/categories/action" ? navStyles.active : ""}`}>
                    <FaList className="text-xl mr-3" />
                    Action
                  </Link>
                </li>
                <li>
                  <Link to="/categories/adventure" onClick={closeAllOverlays} className={`${navStyles.common} ${location.pathname === "/categories/adventure" ? navStyles.active : ""}`}>
                    <FaList className="text-xl mr-3" />
                    Adventure
                  </Link>
                </li>
                <li>
                  <Link to="/categories/rpg" onClick={closeAllOverlays} className={`${navStyles.common} ${location.pathname === "/categories/rpg" ? navStyles.active : ""}`}>
                    <FaList className="text-xl mr-3" />
                    RPG
                  </Link>
                </li>
                <li>
                  <Link to="/categories/shooter" onClick={closeAllOverlays} className={`${navStyles.common} ${location.pathname === "/categories/shooter" ? navStyles.active : ""}`}>
                    <FaList className="text-xl mr-3" />
                    Shooter
                  </Link>
                </li>
                <li>
                  <Link to="/categories/sports" onClick={closeAllOverlays} className={`${navStyles.common} ${location.pathname === "/categories/sports" ? navStyles.active : ""}`}>
                    <FaList className="text-xl mr-3" />
                    Sports
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Desktop Navigation (Always Visible) */}
        <div className="hidden sm:flex items-center space-x-3">
          <Link to="/home" onClick={closeAllOverlays} className={`${navStyles.common} ${location.pathname === "/home" ? navStyles.active : ""}`}>
            <FaHome className="text-xl mr-3" />
            Home
          </Link>
          <Link to="/discover" onClick={closeAllOverlays} className={`${navStyles.common} ${location.pathname === "/discover" ? navStyles.active : ""}`}>
            <FaCompass className="text-xl mr-3" />
            Discover
          </Link>
          <div className="relative" ref={categoriesRef}>
            <button onClick={() => setCategoriesOpen(!isCategoriesOpen)} className={`${navStyles.common} text-left w-full`}>
              <FaList className="text-xl mr-3" />
              Categories
            </button>
            {isCategoriesOpen && (
              <div className="absolute right-0 top-12 bg-gray-900 text-white p-4 rounded-lg shadow-lg w-40 z-20 transform transition-all duration-300 scale-100 opacity-100 translate-y-0">
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/categories/action"
                      onClick={() => {
                        // console.log("Navigating to /categories/action");
                        setTimeout(() => {
                          // console.log("Closing categories overlay");
                          closeAllOverlays();
                        }, 100);
                      }}
                      className={`${navStyles.common} ${location.pathname === "/categories/action" ? navStyles.active : ""}`}
                    >
                      Action
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/categories/adventure"
                      onClick={() => {
                        // console.log("Navigating to /categories/adventure");
                        setTimeout(() => {
                          // console.log("Closing categories overlay");
                          closeAllOverlays();
                        }, 100);
                      }}
                      className={`${navStyles.common} ${location.pathname === "/categories/adventure" ? navStyles.active : ""}`}
                    >
                      Adventure
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/categories/rpg"
                      onClick={() => {
                        // console.log("Navigating to /categories/rpg");
                        setTimeout(() => {
                          // console.log("Closing categories overlay");
                          closeAllOverlays();
                        }, 100);
                      }}
                      className={`${navStyles.common} ${location.pathname === "/categories/rpg" ? navStyles.active : ""}`}
                    >
                      RPG
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/categories/shooter"
                      onClick={() => {
                        // console.log("Navigating to /categories/shooter");
                        setTimeout(() => {
                          // console.log("Closing categories overlay");
                          closeAllOverlays();
                        }, 100);
                      }}
                      className={`${navStyles.common} ${location.pathname === "/categories/shooter" ? navStyles.active : ""}`}
                    >
                      Shooter
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/categories/sports"
                      onClick={() => {
                        // console.log("Navigating to /categories/sports");
                        setTimeout(() => {
                          // console.log("Closing categories overlay");
                          closeAllOverlays();
                        }, 100);
                      }}
                      className={`${navStyles.common} ${location.pathname === "/categories/sports" ? navStyles.active : ""}`}
                    >
                      Sports
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Friends Button */}
        {authToken && (
          <button onClick={() => setFriendsOpen(!isFriendsOpen)} className="focus:outline-none">
            <FaUserFriends className="text-xl cursor-pointer hover:text-blue-300 transition-transform duration-200 hover:scale-105" />
          </button>
        )}

        {/* Profile/Auth Section */}
        {authToken ? (
          <div className="relative" ref={profileRef}>
            <button onClick={() => setProfileOpen(!isProfileOpen)} className="focus:outline-none">
              <FaUser onClick={closeAllOverlays} className="text-xl cursor-pointer hover:text-blue-300 transition-transform duration-200 hover:scale-105" />
            </button>
            <div
              className={`absolute right-0 top-12 bg-gray-900 text-white p-4 rounded-lg shadow-lg w-40 z-20 transform transition-all duration-300 ${isProfileOpen ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 -translate-y-3 pointer-events-none"}`}
            >
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/profile" onClick={closeAllOverlays} className={`${navStyles.common} ${location.pathname === "/profile" ? navStyles.active : ""}`}>
                    <FaUser className="text-xl mr-3" />
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/library" onClick={closeAllOverlays} className={`${navStyles.common} ${location.pathname === "/library" ? navStyles.active : ""}`}>
                    <FaBook className="text-xl mr-3" />
                    Library
                  </Link>
                </li>
                <li>
                  <Link to="/subscription" onClick={closeAllOverlays} className={`${navStyles.common} ${location.pathname === "/subscription" ? navStyles.active : ""}`}>
                    <FaCreditCard className="text-xl mr-3" />
                    Subscription
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className={`${navStyles.common} text-left w-full hover:border-y-2 hover:border-blue-500 transition-all rounded-full`}
                  >
                    <FaSignOutAlt className="text-xl mr-3" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <Link
            to="/signin"
            className={`${navStyles.common} hover:border-y-2 hover:border-blue-500 transition-all rounded-full text-sm sm:text-base`}
          >
            <FaSignInAlt className="text-xl mr-3" />
            Sign In
          </Link>
        )}
      </div>

      {/* Friends Sidebar */}
      {authToken && (
        <FriendsSidebar isOpen={isFriendsOpen} onClose={() => setFriendsOpen(false)} sidebarRef={friendsSidebarRef} />
      )}
    </nav>
  );
});

export default Navbar;