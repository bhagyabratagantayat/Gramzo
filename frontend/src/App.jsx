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
import ProductDetail from './pages/ProductDetail';
import ServiceDetail from './pages/ServiceDetail';

import { AuthProvider, useAuth } from './context/AuthContext';

import DashboardGateway from './components/DashboardGateway';
import AdminDashboard from './pages/AdminDashboard';

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
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route path="/services" element={<Services />} />

          {/* Authenticated Dashboard Gateway */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardGateway />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/prices" element={<Prices />} />
            <Route path="/user/bookings" element={<AllBookings />} />
          </Route>

          {/* Agent & Admin Restricted Access */}
          <Route element={<ProtectedRoute allowedRoles={['Agent', 'Admin']} />}>
            <Route path="/earnings" element={<Earnings />} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/agent/marketplace" element={<AgentMarketplace />} />
          </Route>

          {/* Admin Management Panel */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/all-bookings" element={<AllBookings />} />
          </Route>

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
