// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import "./tailwind.css";
// import { FaSearch, FaUser } from "react-icons/fa";
// import { TfiAlignRight } from "react-icons/tfi";

// function Navbar() {
//   const [isProfileOpen, setProfileOpen] = useState(false);
//   const [isMenuOpen, setMenuOpen] = useState(false);
//   const [isSearchOpen, setSearchOpen] = useState(false);

//   // Close all overlays
//   const closeAllOverlays = () => {
//     setProfileOpen(false);
//     setMenuOpen(false);
//     setSearchOpen(false);
//   };

//   // Toggle Profile with Animation
//   const toggleProfile = () => {
//     setProfileOpen((prev) => !prev);
//     setMenuOpen(false);
//     setSearchOpen(false);
//   };

//   // Toggle Search Overlay
//   const toggleSearch = () => {
//     setSearchOpen((prev) => !prev);
//     setProfileOpen(false);
//     setMenuOpen(false);
//   };

//   // Toggle Menu Overlay (Expands Left)
//   const toggleMenu = () => {
//     setMenuOpen((prev) => !prev);
//     setProfileOpen(false);
//     setSearchOpen(false);
//   };

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (!event.target.closest(".profile-dropdown")) {
//         setProfileOpen(false);
//       }
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => {
//       document.removeEventListener("click", handleClickOutside);
//     };
//   }, []);

//   return (
//     <nav className="navbar flex items-center justify-between px-4 py-2 bg-gray-800 text-white relative z-10">
//       {/* Left Side: Logo, Name, Search */}
//       <div className="flex items-center space-x-4">
//         <Link to="/home">
//           <img
//             src="https://res.cloudinary.com/dp5upogbb/image/upload/v1738649003/po2fjar6stgbf9gajstf.webp"
//             alt="Logo"
//             className="w-10 h-10 cursor-pointer rounded"
//           />
//         </Link>
//         <h1 className="text-xl font-bold">VerMio Play</h1>

//         {/* Search Bar Expands to Right */}
//         <div
//           className={`relative flex items-center transition-all duration-500 ${
//             isSearchOpen ? "bg-blue-800 py-1 px-3 rounded-3xl" : ""
//           }`}
//         >
//           {isSearchOpen ? (
//             <div className="flex items-center">
//               <button
//                 onClick={toggleSearch}
//                 className="focus:outline-none rotate-90 transition-all duration-300"
//               >
//                 <FaSearch className="text-2xl cursor-pointer text-white" />
//               </button>
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="ml-3 bg-transparent text-white outline-none"
//               />
//             </div>
//           ) : (
//             <button onClick={toggleSearch} className="focus:outline-none">
//               <FaSearch className="text-2xl cursor-pointer" />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Right Side: Menu, Profile */}
//       <div className="flex items-center space-x-4">
//         {/* Menu Expands to Left Side */}
//         <div
//           className={`relative flex transition-all duration-500 ${
//             isMenuOpen ? "bg-gray-900 py-1 px-3 rounded-3xl" : ""
//           }`}
//         >
//           {isMenuOpen ? (
//             <div className="flex items-center">
//               <button
//                 onClick={toggleMenu}
//                 className="focus:outline-none rotate-90 transition-all duration-300"
//               >
//                 <TfiAlignRight className="text-2xl cursor-pointer text-white" />
//               </button>
//               <div className="ml-3 mt-1">
//                 <ul className="space-y-2 space-x-10 flex">
//                   <li>
//                     <Link to="/home" onClick={closeAllOverlays}>Home</Link>
//                   </li>
//                   <li>
//                     <Link to="/discover" onClick={closeAllOverlays}>Discover</Link>
//                   </li>
//                   <li>
//                     <Link to="/categories" onClick={closeAllOverlays}>Categories</Link>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           ) : (
//             <button onClick={toggleMenu} className="focus:outline-none">
//               <TfiAlignRight className="text-2xl cursor-pointer" />
//             </button>
//           )}
//         </div>

//         {/* Profile Button with Dropdown Animation */}
//         <div className="relative profile-dropdown">
//           <button onClick={toggleProfile} className="focus:outline-none">
//             <FaUser className="text-2xl cursor-pointer" />
//           </button>

//           {/* Profile Menu with Slide & Fade Animation */}
//           <div
//             className={`absolute right-0 top-12 bg-gray-900 text-white p-4 rounded-lg shadow-lg w-40 z-20 transform transition-all duration-300 ${
//               isProfileOpen ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 -translate-y-3 pointer-events-none"
//             }`}
//           >
//             <ul className="space-y-3">
//               <li>
//                 <Link to="/profile" onClick={closeAllOverlays}>Username</Link>
//               </li>
//               <li>
//                 <Link to="/library" onClick={closeAllOverlays}>Library</Link>
//               </li>
//               <li>
//                 <Link to="/subscription" onClick={closeAllOverlays}>Subscription</Link>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

import React, { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./tailwind.css";
import { FaSearch, FaUser } from "react-icons/fa";
import { TfiAlignRight } from "react-icons/tfi";

function Navbar() {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);

  const location = useLocation();
  const profileRef = useRef(null);

  // Close all overlays
  const closeAllOverlays = () => {
    setProfileOpen(false);
    setMenuOpen(false);
    setSearchOpen(false);
  };

  // Toggle Profile Dropdown
  const toggleProfile = () => {
    setProfileOpen(!isProfileOpen);
    setMenuOpen(false);
    setSearchOpen(false);
  };

  // Toggle Search Overlay
  const toggleSearch = () => {
    setSearchOpen(!isSearchOpen);
    setProfileOpen(false);
    setMenuOpen(false);
  };

  // Toggle Menu Overlay
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
    setProfileOpen(false);
    setSearchOpen(false);
  };

  return (
    <nav className="navbar flex items-center justify-between px-4 py-2 bg-gray-800 text-white relative z-10">
      {/* Left Side: Logo, Name, Search */}
      <div className="flex items-center space-x-4">
        <Link to="/home">
          <img
            src="https://res.cloudinary.com/dp5upogbb/image/upload/v1738649003/po2fjar6stgbf9gajstf.webp"
            alt="Logo"
            className="w-10 h-10 cursor-pointer rounded"
          />
        </Link>
        <h1 className="text-xl font-bold">VerMio Play</h1>

        {/* Search Bar Expands to Right */}
        <div
          className={`relative flex items-center transition-all duration-500 ${isSearchOpen ? "bg-gray-900 py-1 px-3 rounded-3xl" : ""
            }`}
        >
          {isSearchOpen ? (
            <div className="flex items-center">
              <button
                onClick={toggleSearch}
                className="focus:outline-none rotate-90 transition-all duration-300"
              >
                <FaSearch className="text-2xl cursor-pointer text-white" />
              </button>
              <input
                type="text"
                placeholder="Search..."
                className="ml-3 bg-transparent text-white outline-none"
              />
            </div>
          ) : (
            <button onClick={toggleSearch} className="focus:outline-none">
              <FaSearch className="text-2xl cursor-pointer" />
            </button>
          )}
        </div>
      </div>

      {/* Right Side: Menu, Profile */}
      <div className="flex items-center space-x-4">
        {/* Menu Expands to Left Side */}
        <div
          className={`relative flex transition-all duration-500 ${isMenuOpen ? "bg-gray-900 py-1 px-3 rounded-3xl" : ""
            }`}
        >
          {isMenuOpen ? (
            <div className="flex items-center">
              <button
                onClick={toggleMenu}
                className="focus:outline-none rotate-90 transition-all duration-300"
              >
                <TfiAlignRight className="text-2xl cursor-pointer text-white" />
              </button>
              <div className="ml-3 mt-1">
                <ul className="flex space-x-6">
                  {["/home", "/discover", "/categories"].map((path) => (
                    <li key={path} className="relative">
                      <Link
                        to={path}
                        onClick={closeAllOverlays}
                        className={`relative text-white hover:text-blue-300 transition-colors pb-1 ${location.pathname === path
                            ? "text-blue-00 font-bold"
                            : ""
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
            <button onClick={toggleMenu} className="focus:outline-none">
              <TfiAlignRight className="text-2xl cursor-pointer" />
            </button>
          )}
        </div>

        {/* Profile Button with Dropdown Animation */}
        <div className="relative" ref={profileRef}>
          <button onClick={toggleProfile} className="focus:outline-none">
            <FaUser className="text-2xl cursor-pointer" />
          </button>

          {/* Profile Menu with Slide & Fade Animation */}
          <div
            className={`absolute right-0 top-12 bg-gray-900 text-white p-4 rounded-lg shadow-lg w-40 z-20 transform transition-all duration-300 ${isProfileOpen
                ? "scale-100 opacity-100 translate-y-0"
                : "scale-90 opacity-0 -translate-y-3 pointer-events-none"
              }`}
          >
            <ul className="space-y-3">
              {["/profile", "/library", "/subscription"].map((path) => (
                <li key={path} className="relative">
                  <Link
                    to={path}
                    onClick={closeAllOverlays}
                    className={`relative text-white hover:text-blue-300 transition-colors pb-1 ${location.pathname === path
                        ? "text-blue-500 font-bold"
                        : ""
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

