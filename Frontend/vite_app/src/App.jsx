import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Library from './pages/Library';
import Discover from './pages/Discover';
import Categories from './pages/Categories';
import GamePage from './pages/GamePage';
import './components/tailwind.css'
import Footer from './components/Footer';
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Router>
      <Navbar />
      <div className='relative top-20 h-full'>
        <Routes>
          {/* Default route for home */}
          <Route path="/" exact element={<Home />} />

          {/* Other routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/categories/:catname" element={<Categories />} />
          <Route path="/game/:id" element={<GamePage />} />
        </Routes>
      </div>
      <Footer />
      <ToastContainer />
    </Router>
  );
}

export default App;
