import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaXTwitter, FaYoutube, FaInstagram } from 'react-icons/fa6';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white mt-25 py-8 px-4 md:px-16 lg:px-32">
      <div className="flex flex-col md:flex-row justify-between items-center">
        {/* Left Side - Support Links */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-cyan-400 italic">SUPPORTS</h3>
          <div className="grid grid-cols-3 gap-4 mt-2 text-center text-blue-300">
            <Link to="/privacy" className="hover:text-cyan-400">PRIVACY POLICY</Link>
            <Link to="/terms" className="hover:text-cyan-400">TERM OF SERVICE</Link>
            <Link to="/cookies" className="hover:text-cyan-400">COOKIES</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2 text-blue-300 place-items-center">
            <Link to="/about" className="hover:text-cyan-400">ABOUT US</Link>
            <Link to="/contact" className="hover:text-cyan-400">CONTACT US</Link>
          </div>
        </div>

        {/* Right Side - Logo and Social Links */}
        <div className="flex flex-col items-center mt-6 md:mt-0">
          <Link to="/" className="flex flex-col items-center gap-2" onClick={scrollToTop}>
            <img
              src="https://res.cloudinary.com/dp5upogbb/image/upload/v1738649003/po2fjar6stgbf9gajstf.webp"
              alt="Logo"
              className="w-12 h-12 cursor-pointer rounded"
            />
            <span className="text-xl font-bold text-cyan-400 italic">VerMio Play</span>
          </Link>
          <div className="flex gap-4 mt-4">
            <a href="#" className="text-blue-400 hover:text-cyan-400"><FaFacebookF size={24} /></a>
            <a href="#" className="text-blue-400 hover:text-cyan-400"><FaXTwitter size={24} /></a>
            <a href="#" className="text-blue-400 hover:text-cyan-400"><FaYoutube size={24} /></a>
            <a href="#" className="text-blue-400 hover:text-cyan-400"><FaInstagram size={24} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
