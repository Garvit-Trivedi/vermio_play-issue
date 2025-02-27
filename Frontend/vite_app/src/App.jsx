// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Library from './pages/Library';
// import Discover from './pages/Discover';
// import Categories from './pages/Categories';
// import GamePage from './pages/GamePage';
// import './components/tailwind.css'
// import Footer from './components/Footer';
// import { ToastContainer } from "react-toastify";

// function App() {
//   return (
//     <Router>
//       <Navbar />
//       <div className='relative top-20 h-full'>
//         <Routes>
//           {/* Default route for home */}
//           <Route path="/" exact element={<Home />} />

//           {/* Other routes */}
//           <Route path="/home" element={<Home />} />
//           <Route path="/library" element={<Library />} />
//           <Route path="/discover" element={<Discover />} />
//           <Route path="/categories/:catname" element={<Categories />} />
//           <Route path="/game/:id" element={<GamePage />} />
//         </Routes>
//       </div>
//       <Footer />
//       <ToastContainer />
//     </Router>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Library from './pages/Library';
import Discover from './pages/Discover';
import Categories from './pages/Categories';
import GamePage from './pages/GamePage';
import Footer from './components/Footer';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Router>
      <Navbar />
      <div className='relative top-20 h-full'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/library" element={<Library />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/categories/:catname" element={<Categories />} />
            <Route path="/game/:id" element={<GamePage />} />
          </Route>
        </Routes>
      </div>
      <Footer />
      <ToastContainer />
    </Router>
  );
}

export default App;
