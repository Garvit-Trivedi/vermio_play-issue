import React, { useState, useContext } from 'react';
import { signIn } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

const SignIn = () => {
  const { setAuthToken } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    email_id: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await signIn(credentials);
      setAuthToken(data.token);
      toast.success('Sign-in successful!');
      navigate('/home');
    } catch (error) {
      toast.error(error.message || 'Sign-in failed');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dp5upogbb/image/upload/v1738920591/DALL_E_2025-02-07_14.59.09_-_A_sleek_and_modern_banner_for_the_Vermio_Play_website._The_design_should_focus_on_a_premium_gaming_experience_with_a_futuristic_high-tech_aesthetic_jk4hfs.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Semi-transparent overlay for background image */}
      <div className="absolute inset-0 bg-gray-900/40 backdrop-brightness-80"></div>

      {/* Sign-in Card (Centered) */}
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)] px-4 relative z-10">
        <div className="bg-gray-900/85 p-6 sm:p-8 rounded-2xl shadow-lg border border-cyan-500 max-w-md w-full transition-all duration-300">
          <div className="flex flex-col items-center mb-6">
            <img
              src="https://res.cloudinary.com/dp5upogbb/image/upload/v1738649003/po2fjar6stgbf9gajstf.webp"
              alt="VerMio Play Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 mb-4 rounded-full"
            />
            <h2 className="text-2xl sm:text-3xl font-bold text-cyan-400 italic">SIGN IN</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                value={credentials.email_id}
                onChange={(e) => setCredentials({ ...credentials, email_id: e.target.value })}
                placeholder="Email ID / Username"
                className="w-full p-3 border-b-2 border-cyan-400 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 rounded-t-lg"
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="Password"
                className="w-full p-3 border-b-2 border-cyan-400 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 rounded-t-lg pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
              <button
                type="button"
                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400"
              >
                <span className="text-sm">Forgot password?</span>
              </button>
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-all duration-200 font-semibold"
            >
              SIGN IN
            </button>
            <p className="text-center text-sm text-gray-400">
              Don’t have an account?{' '}
              <Link to="/signup" className="text-cyan-400 hover:text-cyan-500">Create Account</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;