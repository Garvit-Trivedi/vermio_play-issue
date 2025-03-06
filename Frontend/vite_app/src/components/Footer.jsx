import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaXTwitter, FaYoutube, FaInstagram } from 'react-icons/fa6';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white mt-25 py-6 px-4 sm:px-8 md:px-16 lg:px-32">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-cyan-400 italic">SUPPORTS</h3>
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-2 text-center text-blue-300">
            <Link to="/privacy" className="hover:text-cyan-400 text-sm sm:text-base">PRIVACY POLICY</Link>
            <Link to="/terms" className="hover:text-cyan-400 text-sm sm:text-base">TERM OF SERVICE</Link>
            <Link to="/cookies" className="hover:text-cyan-400 text-sm sm:text-base">COOKIES</Link>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-2 text-blue-300 place-items-center">
            <Link to="/about" className="hover:text-cyan-400 text-sm sm:text-base">ABOUT US</Link>
            <Link to="/contact" className="hover:text-cyan-400 text-sm sm:text-base">CONTACT US</Link>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <Link to="/" className="flex flex-col items-center gap-2" onClick={scrollToTop}>
            <img
              src="https://res.cloudinary.com/dp5upogbb/image/upload/v1738649003/po2fjar6stgbf9gajstf.webp"
              alt="Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 cursor-pointer rounded object-contain"
            />
            <span className="text-lg sm:text-xl font-bold text-cyan-400 italic">VerMio Play</span>
          </Link>
          <div className="flex gap-3 sm:gap-4 mt-4">
            <a href="#" className="text-blue-400 hover:text-cyan-400"><FaFacebookF size={20} /></a>
            <a href="#" className="text-blue-400 hover:text-cyan-400"><FaXTwitter size={20} /></a>
            <a href="#" className="text-blue-400 hover:text-cyan-400"><FaYoutube size={20} /></a>
            <a href="#" className="text-blue-400 hover:text-cyan-400"><FaInstagram size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;