import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './AuthContext';
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
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="relative top-20 flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
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
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;