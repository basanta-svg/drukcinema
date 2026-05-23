import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#141414] text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={
            <div className="min-h-screen flex items-center justify-center pt-20">
              <div className="text-center">
                <div className="text-6xl mb-4">🎬</div>
                <h1 className="text-3xl font-black text-white mb-2">All Movies</h1>
                <p className="text-gray-400">Coming soon — full movie listing page</p>
              </div>
            </div>
          } />
          <Route path="/cinemas" element={
            <div className="min-h-screen flex items-center justify-center pt-20">
              <div className="text-center">
                <div className="text-6xl mb-4">🏟️</div>
                <h1 className="text-3xl font-black text-white mb-2">Cinemas</h1>
                <p className="text-gray-400">Coming soon — cinema listings page</p>
              </div>
            </div>
          } />
          <Route path="/login" element={
            <div className="min-h-screen flex items-center justify-center pt-20">
              <div className="text-center">
                <div className="text-6xl mb-4">🔐</div>
                <h1 className="text-3xl font-black text-white mb-2">Sign In</h1>
                <p className="text-gray-400">Coming soon — authentication page</p>
              </div>
            </div>
          } />
          <Route path="/register" element={
            <div className="min-h-screen flex items-center justify-center pt-20">
              <div className="text-center">
                <div className="text-6xl mb-4">📝</div>
                <h1 className="text-3xl font-black text-white mb-2">Register</h1>
                <p className="text-gray-400">Coming soon — registration page</p>
              </div>
            </div>
          } />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
