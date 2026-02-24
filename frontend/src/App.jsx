import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Prices from './pages/Prices';
import Services from './pages/Services';
import Marketplace from './pages/Marketplace';
import Notices from './pages/Notices';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 15px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/prices" element={<Route path="/prices" element={<Prices />} />} />
            <Route path="/services" element={<Services />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/notices" element={<Notices />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
