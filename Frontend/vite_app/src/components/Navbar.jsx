// import React, { useState, useRef, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import "./tailwind.css";
// import { FaUser } from "react-icons/fa";
// import { TfiAlignRight } from "react-icons/tfi";
// import SearchBar from "./searchBar"; // Import SearchBar component

// function Navbar() {
//   const [isProfileOpen, setProfileOpen] = useState(false);
//   const [isMenuOpen, setMenuOpen] = useState(false);
//   const [isCategoriesOpen, setCategoriesOpen] = useState(false);
//   const location = useLocation();
//   const profileRef = useRef(null);
//   const menuRef = useRef(null);

//   // Close all overlays when navigating
//   const closeAllOverlays = () => {
//     setProfileOpen(false);
//     setMenuOpen(false);
//     setCategoriesOpen(false);
//   };

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (
//         profileRef.current && !profileRef.current.contains(event.target) &&
//         menuRef.current && !menuRef.current.contains(event.target)
//       ) {
//         closeAllOverlays();
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <nav className="navbar flex items-center justify-between px-4 py-2 bg-gray-800 text-white fixed w-full z-50">
//       {/* Left Side: Logo, Name, Search */}
//       <div className="flex items-center space-x-4">
//         <Link to="/home" onClick={closeAllOverlays}>
//           <img
//             src="https://res.cloudinary.com/dp5upogbb/image/upload/v1738649003/po2fjar6stgbf9gajstf.webp"
//             alt="Logo"
//             className="w-30 h-10 cursor-pointer rounded"
//           />
//         </Link>
//         <Link to="/home" onClick={closeAllOverlays}>
//           <h1 className="text-xl w-max font-bold">VerMio Play</h1>
//         </Link>
//         {/* Integrated Search Component */}
//         <SearchBar />
//       </div>

//       {/* Right Side: Menu, Profile */}
//       <div className="flex items-center space-x-4">
//         {/* Menu */}
//         <div ref={menuRef} className={`relative flex transition-all duration-500 ${isMenuOpen ? "bg-gray-900 py-1 px-3 rounded-3xl" : ""}`}>
//           <button onClick={() => setMenuOpen(!isMenuOpen)} className="focus:outline-none">
//             <TfiAlignRight className={`text-2xl cursor-pointer transition-all duration-300 ${isMenuOpen ? "rotate-90" : ""}`} />
//           </button>

//           {isMenuOpen && (
//             <div className="flex items-center">
//               <div className="ml-3 mt-1">
//                 <ul className="flex space-x-6">
//                   <li>
//                     <Link to="/home" onClick={closeAllOverlays} className={`relative text-white hover:text-blue-300 transition-colors pb-1 ${location.pathname === "/home" ? "text-blue-500 font-bold" : ""}`}>
//                       Home
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="/discover" onClick={closeAllOverlays} className={`relative text-white hover:text-blue-300 transition-colors pb-1 ${location.pathname === "/discover" ? "text-blue-500 font-bold" : ""}`}>
//                       Discover
//                     </Link>
//                   </li>

//                   {/* Categories Dropdown */}
//                   <li className="relative">
//                     <button onClick={() => setCategoriesOpen(!isCategoriesOpen)} className="text-white hover:text-blue-300 transition-colors pb-1">
//                       Categories
//                     </button>
//                     {isCategoriesOpen && (
//                       <div className="absolute left-0 mt-2 bg-gray-900 text-white shadow-lg rounded-lg py-2 w-40">
//                         {["Action", "Adventure", "RPG", "Shooter", "Sports"].map((category) => (
//                           <Link key={category} to={`/categories/${category.toLowerCase()}`} onClick={closeAllOverlays} className="block px-4 py-2 hover:bg-gray-800 transition-all">
//                             {category}
//                           </Link>
//                         ))}
//                       </div>
//                     )}
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Profile Button with Dropdown Animation */}
//         <div className="relative" ref={profileRef}>
//           <button onClick={() => setProfileOpen(!isProfileOpen)} className="focus:outline-none">
//             <FaUser className="text-2xl cursor-pointer" />
//           </button>

//           {/* Profile Menu with Slide & Fade Animation */}
//           <div className={`absolute right-0 top-12 bg-gray-900 text-white p-4 rounded-lg shadow-lg w-40 z-20 transform transition-all duration-300 ${isProfileOpen ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 -translate-y-3 pointer-events-none"}`}>
//             <ul className="space-y-3">
//               {[
//                 { path: "/profile", label: "Profile" },
//                 { path: "/library", label: "Library" },
//                 { path: "/subscription", label: "Subscription" }
//               ].map(({ path, label }) => (
//                 <li key={path} className="relative">
//                   <Link to={path} onClick={closeAllOverlays} className={`relative text-white hover:text-blue-300 transition-colors pb-1 ${location.pathname === path ? "text-blue-500 font-bold" : ""}`}>
//                     {label}
//                     {location.pathname === path && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500 transition-all duration-300"></span>}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;


import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./tailwind.css";
import { FaUser } from "react-icons/fa";
import { TfiAlignRight } from "react-icons/tfi";
import SearchBar from "./searchBar"; // Import SearchBar component

function Navbar() {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isCategoriesOpen, setCategoriesOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Convert to boolean
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/signin"); // Redirect to Sign In
  };

  // Close all overlays when navigating
  const closeAllOverlays = () => {
    setProfileOpen(false);
    setMenuOpen(false);
    setCategoriesOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileRef.current && !profileRef.current.contains(event.target) &&
        menuRef.current && !menuRef.current.contains(event.target)
      ) {
        closeAllOverlays();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar flex items-center justify-between px-4 py-2 bg-gray-800 text-white fixed w-full z-50">
      {/* Left Side: Logo, Name, Search */}
      <div className="flex items-center space-x-4">
        <Link to="/home" onClick={closeAllOverlays}>
          <img
            src="https://res.cloudinary.com/dp5upogbb/image/upload/v1738649003/po2fjar6stgbf9gajstf.webp"
            alt="Logo"
            className="w-30 h-10 cursor-pointer rounded"
          />
        </Link>
        <Link to="/home" onClick={closeAllOverlays}>
          <h1 className="text-xl w-max font-bold">VerMio Play</h1>
        </Link>
        {/* Integrated Search Component */}
        <SearchBar />
      </div>

      {/* Right Side: Menu, Profile/Sign In */}
      <div className="flex items-center space-x-4">
        {/* Menu */}
        <div ref={menuRef} className={`relative flex transition-all duration-500 ${isMenuOpen ? "bg-gray-900 py-1 px-3 rounded-3xl" : ""}`}>
          <button onClick={() => setMenuOpen(!isMenuOpen)} className="focus:outline-none">
            <TfiAlignRight className={`text-2xl cursor-pointer transition-all duration-300 ${isMenuOpen ? "rotate-90" : ""}`} />
          </button>

          {isMenuOpen && (
            <div className="flex items-center">
              <div className="ml-3 mt-1">
                <ul className="flex space-x-6">
                  <li>
                    <Link to="/home" onClick={closeAllOverlays} className={`relative text-white hover:text-blue-300 transition-colors pb-1 ${location.pathname === "/home" ? "text-blue-500 font-bold" : ""}`}>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/discover" onClick={closeAllOverlays} className={`relative text-white hover:text-blue-300 transition-colors pb-1 ${location.pathname === "/discover" ? "text-blue-500 font-bold" : ""}`}>
                      Discover
                    </Link>
                  </li>

                  {/* Categories Dropdown */}
                  <li className="relative">
                    <button onClick={() => setCategoriesOpen(!isCategoriesOpen)} className="text-white hover:text-blue-300 transition-colors pb-1">
                      Categories
                    </button>
                    {isCategoriesOpen && (
                      <div className="absolute left-0 mt-2 bg-gray-900 text-white shadow-lg rounded-lg py-2 w-40">
                        {["Action", "Adventure", "RPG", "Shooter", "Sports"].map((category) => (
                          <Link key={category} to={`/categories/${category.toLowerCase()}`} onClick={closeAllOverlays} className="block px-4 py-2 hover:bg-gray-800 transition-all">
                            {category}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Profile / Sign In Button */}
        {isAuthenticated ? (
          // Profile Dropdown when logged in
          <div className="relative" ref={profileRef}>
            <button onClick={() => setProfileOpen(!isProfileOpen)} className="focus:outline-none">
              <FaUser className="text-2xl cursor-pointer" />
            </button>

            {/* Profile Menu with Slide & Fade Animation */}
            <div className={`absolute right-0 top-12 bg-gray-900 text-white p-4 rounded-lg shadow-lg w-40 z-20 transform transition-all duration-300 ${isProfileOpen ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 -translate-y-3 pointer-events-none"}`}>
              <ul className="space-y-3">
                <li>
                  <Link to="/profile" onClick={closeAllOverlays} className={`text-white hover:text-blue-300 transition-colors pb-1 ${location.pathname === "/profile" ? "text-blue-500 font-bold" : ""}`}>
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/library" onClick={closeAllOverlays} className={`text-white hover:text-blue-300 transition-colors pb-1 ${location.pathname === "/library" ? "text-blue-500 font-bold" : ""}`}>
                    Library
                  </Link>
                </li>
                <li>
                  <Link to="/subscription" onClick={closeAllOverlays} className={`text-white hover:text-blue-300 transition-colors pb-1 ${location.pathname === "/subscription" ? "text-blue-500 font-bold" : ""}`}>
                    Subscription
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-white hover:text-red-400 transition-colors pb-1">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          // Sign In button when not logged in
          <Link to="/signin" className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600 transition-all">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
