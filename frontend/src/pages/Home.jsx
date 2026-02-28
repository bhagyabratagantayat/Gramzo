import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
    HiOutlineSearch,
    HiArrowRight,
    HiOutlineTrendingUp,
    HiOutlineLocationMarker,
    HiOutlineSparkles,
    HiOutlineX,
    HiOutlineBell,
    HiUserCircle,
    HiMicrophone,
    HiOutlineCollection,
    HiOutlineShoppingBag,
    HiOutlineCurrencyRupee,
    HiOutlineArrowNarrowRight
} from 'react-icons/hi';
import { getFallbackImage } from '../utils/imageHelper';

// Category Visual Mapping
const CATEGORY_STYLE_MAP = {
    'Beauty': { icon: '💅', color: '#ec4899', bg: '#fdf2f8' },
    'Repairs': { icon: '🛠️', color: '#3b82f6', bg: '#eff6ff' },
    'Electronics': { icon: '💻', color: '#8b5cf6', bg: '#f5f3ff' },
    'Vegetables': { icon: '🥦', color: '#10b981', bg: '#ecfdf5' },
    'Clothes': { icon: '👕', color: '#ef4444', bg: '#fef2f2' },
    'Real Estate': { icon: '🏠', color: '#f59e0b', bg: '#fffbeb' },
    'Grocery': { icon: '🛒', color: '#059669', bg: '#ecfdf5' },
    'Pharmacy': { icon: '💊', color: '#ef4444', bg: '#fef2f2' },
    'Plumbing': { icon: '🔧', color: '#2563eb', bg: '#eff6ff' },
    'Cleaning': { icon: '🧹', color: '#6366f1', bg: '#eef2ff' },
    'Default': { icon: '📦', color: '#6b7280', bg: '#f3f4f6' }
};

const getCategoryStyle = (name) => {
    return CATEGORY_STYLE_MAP[name] || CATEGORY_STYLE_MAP.Default;
};

const Home = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [prices, setPrices] = useState([]);
    const [products, setProducts] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMoreCats, setShowMoreCats] = useState(false);
    const [error, setError] = useState(false);

    const fetchData = async () => {
        try {
            const [catRes, marketRes, prodRes, servRes] = await Promise.all([
                api.get('/categories'),
                api.get('/market'),
                api.get('/products'),
                api.get('/services')
            ]);
            setCategories(catRes.data.data);
            setPrices(marketRes.data.data);
            setProducts(prodRes.data.data);
            setServices(servRes.data.data);
            setError(false);
        } catch (err) {
            console.error('Failed to fetch home data', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const displayedCats = useMemo(() => {
        return showMoreCats ? categories : categories.slice(0, 8);
    }, [categories, showMoreCats]);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <div className="spinner"></div>
        </div>
    );

    return (
        <div className="home-container" style={{ paddingBottom: '0' }}>
            {error && (
                <div style={{ backgroundColor: '#fff1f2', border: '1px solid #ffe4e6', color: '#be123c', padding: '12px 20px', borderRadius: '12px', marginTop: '80px', marginBottom: '-50px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', textAlign: 'center', zIndex: 100, position: 'relative' }}>
                    <span style={{ fontSize: '1.2rem' }}>📡</span> Live data connection limited. Showing latest available content.
                </div>
            )}

            {/* ── 1. SEARCH BAR ─────────────────── */}
            <div className="section-spacer" style={{ position: 'relative', maxWidth: '700px', margin: '48px auto 48px', padding: '0 20px' }}>
                <div className="card-premium glass-morphism" style={{ padding: '8px', borderRadius: '16px' }}>
                    <div style={{ position: 'relative' }}>
                        <HiOutlineSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '1.4rem' }} />
                        <input
                            type="text"
                            placeholder="Search fresh products, local services..."
                            style={{
                                width: '100%',
                                padding: '18px 56px',
                                borderRadius: '12px',
                                border: 'none',
                                outline: 'none',
                                backgroundColor: 'transparent',
                                fontSize: '1.1rem',
                                fontWeight: '500'
                            }}
                        />
                        <HiMicrophone style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-color)', fontSize: '1.3rem', cursor: 'pointer' }} />
                    </div>
                </div>
            </div>

            {/* ── 2. DYNAMIC CATEGORIES ───────────────── */}
            <section className="section-spacer" style={{ padding: '0 20px' }}>
                <div className="category-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {displayedCats.length > 0 ? (
                        displayedCats.map((cat) => {
                            const style = getCategoryStyle(cat.name);
                            return (
                                <div
                                    key={cat._id}
                                    className="cat-item hover-lift-premium"
                                    style={{ textAlign: 'center', cursor: 'pointer' }}
                                    onClick={() => navigate(cat.type === 'service' ? '/services' : '/marketplace')}
                                >
                                    <div className="cat-circle shadow-sm" style={{ backgroundColor: style.bg, color: style.color, margin: '0 auto 12px' }}>
                                        {style.icon}
                                    </div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151', display: 'block' }}>{cat.name}</span>
                                </div>
                            );
                        })
                    ) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            Discovering community categories...
                        </div>
                    )}
                </div>
                {categories.length > 8 && (
                    <button
                        onClick={() => setShowMoreCats(!showMoreCats)}
                        style={{ display: 'block', margin: '32px auto 0', border: 'none', background: 'transparent', color: 'var(--primary-color)', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer' }}
                    >
                        {showMoreCats ? 'Show Less' : 'Explore All Categories'}
                    </button>
                )}
            </section>

            {/* ── 3. HERO / ROLE-BASED WELCOME ────────── */}
            <section className="section-spacer" style={{ padding: '0 20px' }}>
                <div className="card-premium" style={{
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                    color: '#fff',
                    padding: '48px 32px',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, margin: 0, letterSpacing: '-0.03em' }}>
                            {user ? `Welcome back, ${user.name}!` : "Your Neighborhood, Digitized."}
                        </h2>
                        <p style={{ fontSize: '1.1rem', opacity: 0.9, marginTop: '12px', maxWidth: '600px', lineHeight: '1.6' }}>
                            {user?.role === 'Agent'
                                ? "Manage your community impact. Check your listings and respond to local needs from your professional panel."
                                : user?.role === 'Admin'
                                    ? "Command Center Active. Monitor growth, verify providers, and manage system-wide notifications."
                                    : "Discover trusted repair pros, beauty experts, and fresh local produce right next door."}
                        </p>

                        <div style={{ marginTop: '32px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            {isAuthenticated ? (
                                <>
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className="btn-primary"
                                        style={{ backgroundColor: '#fff', color: '#1e3a8a', padding: '14px 28px', fontSize: '1rem' }}
                                    >
                                        Go to Dashboard
                                    </button>
                                    {user.role === 'Agent' && (
                                        <button
                                            onClick={() => navigate('/my-listings')}
                                            className="btn-secondary"
                                            style={{ color: '#fff', borderColor: '#fff' }}
                                        >
                                            Manage My Listings
                                        </button>
                                    )}
                                    {user.role === 'Admin' && (
                                        <button
                                            onClick={() => navigate('/admin')}
                                            className="btn-secondary"
                                            style={{ color: '#fff', borderColor: '#fff' }}
                                        >
                                            Admin Panel
                                        </button>
                                    )}
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => navigate('/services')}
                                        className="btn-primary"
                                        style={{ backgroundColor: '#fff', color: '#1e3a8a', padding: '14px 28px' }}
                                    >
                                        Explore Services
                                    </button>
                                    <button
                                        onClick={() => navigate('/signup')}
                                        className="btn-secondary"
                                        style={{ color: '#fff', borderColor: '#fff' }}
                                    >
                                        Register Now
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div style={{ position: 'absolute', right: '-50px', bottom: '-50px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                    <div style={{ position: 'absolute', right: '50px', top: '-20px', fontSize: '8rem', opacity: 0.1 }}>🏘️</div>
                </div>
            </section>

            {/* ── 4. LIVE MARKET INTELLIGENCE ─────────── */}
            <section className="section-spacer" style={{ padding: '0 20px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                        <div>
                            <div style={{ color: 'var(--primary-color)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px' }}>Live Updates</div>
                            <h3 className="section-title-premium" style={{ margin: 0 }}>Market Prices</h3>
                        </div>
                        <Link to="/prices" className="flex-center" style={{ fontWeight: 800, color: 'var(--primary-color)', fontSize: '0.95rem', gap: '4px' }}>
                            Full Market View <HiOutlineArrowNarrowRight />
                        </Link>
                    </div>

                    <div className="responsive-grid-4">
                        {Array.isArray(prices) && prices.length > 0 ? (
                            prices.slice(0, 4).map(item => (
                                <div key={item._id} className="standard-card hover-lift-premium card-premium">
                                    <div className="card-image-wrapper">
                                        <img
                                            src={item.image || getFallbackImage(item.itemName, item.category)}
                                            alt={item.itemName}
                                            loading="lazy"
                                            onError={(e) => { e.target.src = getFallbackImage(item.itemName, item.category); }}
                                        />
                                        <div style={{ position: 'absolute', top: '12px', left: '12px' }} className="badge glass-morphism">
                                            {item.category || 'Commodity'}
                                        </div>
                                    </div>
                                    <div className="card-content" style={{ padding: '20px' }}>
                                        <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 4px', color: '#111827' }}>{item.itemName}</h4>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                                            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary-color)' }}>₹{item.price}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <HiOutlineLocationMarker /> {item.location || 'Local'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="standard-card card-premium" style={{ height: '280px', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #e5e7eb' }}>
                                    <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                                        <HiOutlineTrendingUp style={{ fontSize: '2rem', marginBottom: '12px' }} />
                                        <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Fetching Live Rates...</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* ── 5. TOP SERVICE PROVIDERS ─────────────── */}
            <section className="section-spacer" style={{ backgroundColor: '#fff', padding: '80px 20px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <h3 className="section-title-premium">Popular Services</h3>
                        <p style={{ color: '#6b7280', marginTop: '12px' }}>Book verified professionals for your everyday needs.</p>
                    </div>

                    <div className="responsive-grid">
                        {Array.isArray(services) && services.length > 0 ? (
                            services.slice(0, 3).map(service => (
                                <div
                                    key={service._id}
                                    className="standard-card hover-lift-premium card-premium"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/service/${service._id}`)}
                                >
                                    <div className="card-image-wrapper" style={{ height: '200px' }}>
                                        <img
                                            src={service.image || getFallbackImage(service.title, service.category?.name)}
                                            alt={service.title}
                                            loading="lazy"
                                            onError={(e) => { e.target.src = getFallbackImage(service.title, service.category?.name); }}
                                        />
                                        <div style={{ position: 'absolute', bottom: '12px', right: '12px' }} className="badge glass-morphism">
                                            {service.category?.name || 'Local'}
                                        </div>
                                    </div>
                                    <div className="card-content" style={{ padding: '24px' }}>
                                        <h4 style={{ fontSize: '1.2rem', margin: '0 0 12px', fontWeight: 900 }}>{service.title}</h4>
                                        <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '20px', lineBreak: 'anywhere' }}>{service.description?.substring(0, 80)}...</p>
                                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827' }}>₹{service.price}</div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); navigate(`/service/${service._id}`); }}
                                                className="btn-primary"
                                                style={{ padding: '10px 20px' }}
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', background: '#f8fafc', borderRadius: '20px', border: '2px dashed #e2e8f0' }}>
                                <HiOutlineCollection style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '16px' }} />
                                <h4 style={{ margin: 0 }}>No services listed in your area</h4>
                                <p style={{ color: '#94a3b8', marginTop: '8px' }}>Be the first to list a service in Gramzo!</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ── 6. NEIGHBORHOOD MARKETPLACE ──────────── */}
            <section className="section-spacer" style={{ padding: '80px 20px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                        <h3 className="section-title-premium">Marketplace</h3>
                        <Link to="/marketplace" className="btn-ghost" style={{ borderRadius: '999px', padding: '8px 20px' }}>
                            Shop All <HiArrowRight />
                        </Link>
                    </div>

                    <div className="responsive-grid-4">
                        {Array.isArray(products) && products.length > 0 ? (
                            products.slice(0, 4).map(product => (
                                <div
                                    key={product._id}
                                    className="standard-card hover-lift-premium card-premium"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/product/${product._id}`)}
                                >
                                    <div className="card-image-wrapper">
                                        <img
                                            src={product.image || getFallbackImage(product.title, product.category)}
                                            alt={product.title}
                                            loading="lazy"
                                            onError={(e) => { e.target.src = getFallbackImage(product.title, product.category); }}
                                        />
                                    </div>
                                    <div className="card-content" style={{ padding: '20px' }}>
                                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#374151', marginBottom: '4px' }}>{product.title}</h4>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#111827', marginBottom: '12px' }}>₹{product.price}</div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); navigate(`/product/${product._id}`); }}
                                            className="btn-secondary btn-full"
                                            style={{ fontSize: '0.85rem' }}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', background: '#fff', borderRadius: '20px', border: '1px solid #f3f4f6' }}>
                                <HiOutlineShoppingBag style={{ fontSize: '3rem', color: '#e5e7eb', marginBottom: '16px' }} />
                                <h4 style={{ margin: 0 }}>Market is currently quiet</h4>
                                <Link to="/agent/marketplace" style={{ color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: 700, display: 'block', marginTop: '12px' }}>
                                    + List your first product
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ── 7. PRODUCTION FOOTER ─────────────────── */}
            {/* <footer className="main-footer">
                <div className="footer-grid">
                    <div className="footer-info">
                        <h4>Gramzo</h4>
                        <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '300px' }}>
                            Empowering local communities by bridging the gap between neighborhood services and community members.
                        </p>
                    </div>
                    <div className="footer-links">
                        <h5>Quick Links</h5>
                        <ul>
                            <li><Link to="/services">Local Services</Link></li>
                            <li><Link to="/marketplace">Marketplace</Link></li>
                            <li><Link to="/prices">Market Intelligence</Link></li>
                            <li><Link to="/notifications">Notifications</Link></li>
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h5>Platform</h5>
                        <ul>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact Support</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h5>Account</h5>
                        <ul>
                            <li><Link to="/dashboard">My Dashboard</Link></li>
                            <li><Link to="/login">Sign In</Link></li>
                            <li><Link to="/signup">Register</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Gramzo Technologies. All rights reserved.</p>
                </div>
            </footer> */}
        </div>
    );
};

export default Home;
