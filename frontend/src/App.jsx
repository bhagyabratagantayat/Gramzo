import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LocationBanner from './components/LocationBanner';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Services from './pages/Services';
import Bookings from './pages/Bookings';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import AllBookings from './pages/AllBookings';
import Notices from './pages/Notices';
import MyListings from './pages/MyListings';
import Earnings from './pages/Earnings';
import Prices from './pages/Prices';
import Marketplace from './pages/Marketplace';

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <LocationBanner />
        <main style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 15px' }}>
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

            {/* Agent-only */}
            <Route path="/prices" element={<ProtectedRoute agentOnly><Prices /></ProtectedRoute>} />
            <Route path="/my-listings" element={<ProtectedRoute agentOnly><MyListings /></ProtectedRoute>} />
            <Route path="/earnings" element={<ProtectedRoute agentOnly><Earnings /></ProtectedRoute>} />

            {/* Admin-only */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
            <Route path="/all-bookings" element={<ProtectedRoute adminOnly><AllBookings /></ProtectedRoute>} />
            <Route path="/notices" element={<ProtectedRoute adminOnly><Notices /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
