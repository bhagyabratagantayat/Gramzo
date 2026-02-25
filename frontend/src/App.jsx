import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Prices from './pages/Prices';
import Services from './pages/Services';
import Marketplace from './pages/Marketplace';
import Notices from './pages/Notices';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Earnings from './pages/Earnings';
import AllBookings from './pages/AllBookings';

import MyListings from './pages/MyListings';

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 15px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/services" element={<Services />} />
            <Route path="/prices" element={<Prices />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/earnings" element={<Earnings />} />
            <Route path="/all-bookings" element={<AllBookings />} />
            <Route path="/my-listings" element={<MyListings />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
