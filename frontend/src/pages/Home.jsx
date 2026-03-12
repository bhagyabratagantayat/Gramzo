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
        <div className="page-loading-full">
            <div className="spinner"></div>
        </div>
    );

    return (
        <div className="home-container">
            {error && (
                <div className="alert alert-error flex-center mt-4">
                    📡 Live data connection limited. Showing latest available content.
                </div>
            )}

            {/* ── 1. MODERN HERO SECTION ─────────────────── */}
            <section className="home-hero">
                <div className="app-container">
                    <h1 className="hero-title">
                        {user ? `Welcome back, ${user.name.split(' ')[0]}!` : "Your Neighborhood, Digitized."}
                    </h1>
                    <p className="hero-subtitle">
                        {user?.role === 'Agent'
                            ? "Manage your community impact. Check your listings and respond to local needs."
                            : user?.role === 'Admin'
                                ? "Command Center Active. Monitor growth and manage system notifications."
                                : "Discover trusted local pros and fresh products right next door."}
                    </p>

                    <div className="hero-search-container">
                        <div className="hero-search-wrapper">
                            <HiOutlineSearch className="search-icon-dim" />
                            <input
                                type="text"
                                placeholder="Search products, services, or prices..."
                                className="hero-search-input"
                            />
                            <button className="hero-search-btn">Search</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 2. DYNAMIC CATEGORIES (WhatsApp Status Style) ───────────────── */}
            <section className="section-spacer app-container overflow-hidden">
                <div className="status-scroll-container no-scrollbar">
                    {categories.length > 0 ? (
                        categories.map((cat) => {
                            const style = getCategoryStyle(cat.name);
                            return (
                                <div
                                    key={cat._id}
                                    className="status-item"
                                    onClick={() => navigate(cat.type === 'service' ? '/services' : '/marketplace')}
                                >
                                    <div className="status-circle-wrapper">
                                        <div 
                                            className="status-ring" 
                                            style={{ borderColor: style.color }}
                                        ></div>
                                        <div className="status-circle" style={{ backgroundColor: style.bg }}>
                                            {style.icon}
                                        </div>
                                    </div>
                                    <span className="status-text">{cat.name}</span>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex-center w-full py-4 text-muted">
                            Discovering community categories...
                        </div>
                    )}
                </div>
            </section>

            {/* ── 3. LIVE MARKET PRICES ─────────── */}
            <section className="section-spacer app-container">
                <div className="home-section-title">
                    <h3 className="section-title-premium">Market Prices</h3>
                    <Link to="/prices" className="view-all-link">
                        Full View <HiArrowRight />
                    </Link>
                </div>

                <div className="responsive-grid-4">
                    {Array.isArray(prices) && prices.length > 0 ? (
                        prices.slice(0, 4).map(item => (
                            <Link key={item._id} to="/prices" className="standard-card hover-lift card-premium">
                                <div className="card-image-wrapper">
                                    <img
                                        src={item.image || getFallbackImage(item.itemName, item.category)}
                                        alt={item.itemName}
                                        loading="lazy"
                                        onError={(e) => { e.target.src = getFallbackImage(item.itemName, item.category); }}
                                    />
                                    <div className="card-badge-top badge glass-morphism">
                                        {item.category || 'Price'}
                                    </div>
                                </div>
                                <div className="card-content">
                                    <h4 className="card-title-small">{item.itemName}</h4>
                                    <div className="flex-between">
                                        <div className="text-price">₹{item.price}</div>
                                        <div className="text-location">
                                            <HiOutlineLocationMarker /> {item.location || 'Local'}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        Array(4).fill(0).map((_, i) => (
                            <div key={i} className="skeleton h-48 rounded-xl" />
                        ))
                    )}
                </div>
            </section>

            {/* ── 4. POPULAR SERVICES ─────────────── */}
            <section className="section-spacer py-12 bg-white-bleed">
                <div className="app-container">
                    <div className="home-section-title">
                        <h3 className="section-title-premium">Popular Services</h3>
                        <Link to="/services" className="view-all-link">
                            View All <HiArrowRight />
                        </Link>
                    </div>

                    <div className="responsive-grid">
                        {Array.isArray(services) && services.length > 0 ? (
                            services.slice(0, 4).map(service => (
                                <div
                                    key={service._id}
                                    className="standard-card hover-lift card-premium"
                                    onClick={() => navigate(`/service/${service._id}`)}
                                >
                                    <div className="card-image-wrapper">
                                        <img
                                            src={service.image || getFallbackImage(service.title, service.category?.name)}
                                            alt={service.title}
                                            loading="lazy"
                                            onError={(e) => { e.target.src = getFallbackImage(service.title, service.category?.name); }}
                                        />
                                        <div className="card-badge-bottom badge glass-morphism">
                                            {service.category?.name || 'Local'}
                                        </div>
                                    </div>
                                    <div className="card-content">
                                        <h4 className="card-title-medium">{service.title}</h4>
                                        <p className="card-desc-short">{service.description?.substring(0, 60)}...</p>
                                        <div className="flex-between mt-auto">
                                            <div className="text-price-large">₹{service.price}</div>
                                            <button className="btn-primary btn-sm">Book</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state w-full">
                                <HiOutlineCollection className="empty-state-icon" />
                                <h3>No services available</h3>
                                <p>Be the first to list a service in your community!</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ── 5. MARKETPLACE ──────────── */}
            <section className="section-spacer app-container">
                <div className="home-section-title">
                    <h3 className="section-title-premium">Marketplace</h3>
                    <Link to="/marketplace" className="view-all-link">
                        Shop Items <HiArrowRight />
                    </Link>
                </div>

                <div className="responsive-grid-4">
                    {Array.isArray(products) && products.length > 0 ? (
                        products.slice(0, 4).map(product => (
                            <div
                                key={product._id}
                                className="standard-card hover-lift card-premium"
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
                                <div className="card-content">
                                    <h4 className="card-title-small">{product.title}</h4>
                                    <div className="text-price-mid">₹{product.price}</div>
                                    <button className="btn-secondary btn-full mt-2">View Details</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state w-full">
                            <HiOutlineShoppingBag className="empty-state-icon" />
                            <h3>Market is empty</h3>
                            <p>List your products to start selling today!</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
