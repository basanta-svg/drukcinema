import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar              from './components/Navbar';
import Footer              from './components/Footer';
import HomePage            from './pages/HomePage';
import MoviesPage          from './pages/MoviesPage';
import MovieDetailPage     from './pages/MovieDetailPage';
import SeatSelectionPage   from './pages/SeatSelectionPage';
import BookingSuccessPage  from './pages/BookingSuccessPage';
import LoginPage           from './pages/LoginPage';
import RegisterPage        from './pages/RegisterPage';
import { Film, Building2 } from 'lucide-react';

/* Simple placeholder for pages not yet built */
const Placeholder = ({ title, Icon }) => (
  <div className="min-h-screen flex items-center justify-center pt-20">
    <div className="text-center">
      <div className="w-16 h-16 bg-[#E50914]/10 border border-[#E50914]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon size={28} className="text-[#E50914]" />
      </div>
      <h1 className="text-2xl font-black text-white mb-2">{title}</h1>
      <p className="text-gray-500">Coming soon</p>
    </div>
  </div>
);

/* Pages that show the main Navbar + Footer */
const MainLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#141414] text-white">
          <Routes>
            {/* ── Public with nav+footer ── */}
            <Route path="/"              element={<MainLayout><HomePage /></MainLayout>} />
            <Route path="/movies"        element={<MainLayout><MoviesPage /></MainLayout>} />
            <Route path="/movie/:id"     element={<MainLayout><MovieDetailPage /></MainLayout>} />
            <Route path="/cinemas"       element={<MainLayout><Placeholder title="Cinemas" Icon={Building2} /></MainLayout>} />
            <Route path="/offers"        element={<MainLayout><Placeholder title="Offers & Deals" Icon={Film} /></MainLayout>} />
            <Route path="/about"         element={<MainLayout><Placeholder title="About DrukCinema" Icon={Film} /></MainLayout>} />

            {/* ── Auth pages (no nav/footer) ── */}
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* ── Protected ── */}
            <Route path="/book/:id" element={
              <ProtectedRoute>
                <MainLayout><SeatSelectionPage /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/booking/success" element={
              <ProtectedRoute>
                <MainLayout><BookingSuccessPage /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <MainLayout><Placeholder title="My Profile" Icon={Film} /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/my-bookings" element={
              <ProtectedRoute>
                <MainLayout><Placeholder title="My Bookings" Icon={Film} /></MainLayout>
              </ProtectedRoute>
            } />

            {/* ── 404 ── */}
            <Route path="*" element={
              <MainLayout>
                <div className="min-h-screen flex items-center justify-center pt-20 text-center">
                  <div>
                    <p className="text-7xl font-black text-[#E50914] mb-4">404</p>
                    <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
                    <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
                    <a href="/" className="px-6 py-3 bg-[#E50914] text-white font-semibold rounded-lg hover:bg-[#c8000f] transition-colors">
                      Go Home
                    </a>
                  </div>
                </div>
              </MainLayout>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
