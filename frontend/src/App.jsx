import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LocationBanner from './components/LocationBanner';
import BottomNav from './components/BottomNav';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Services from './pages/Services';
import Bookings from './pages/Bookings';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import AllBookings from './pages/AllBookings';
import Notifications from './pages/Notifications';
import MyListings from './pages/MyListings';
import Earnings from './pages/Earnings';
import Prices from './pages/Prices';
import Marketplace from './pages/Marketplace';
import AgentMarketplace from './pages/AgentMarketplace';

import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-color)' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <LocationBanner />
      <main style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 15px 80px' }}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* User-accessible */}
          <Route path="/services" element={<Services />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/marketplace" element={<Marketplace />} />

          {/* Logged-in accessible */}
          <Route path="/prices" element={<ProtectedRoute><Prices /></ProtectedRoute>} />
          <Route path="/agent/marketplace" element={<ProtectedRoute agentOnly><AgentMarketplace /></ProtectedRoute>} />
          <Route path="/my-listings" element={<ProtectedRoute agentOnly><MyListings /></ProtectedRoute>} />
          <Route path="/earnings" element={<ProtectedRoute agentOnly><Earnings /></ProtectedRoute>} />

          {/* Admin-only */}
          <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
          <Route path="/all-bookings" element={<ProtectedRoute adminOnly><AllBookings /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
