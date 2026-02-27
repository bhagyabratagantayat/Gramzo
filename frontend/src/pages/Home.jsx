import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getUser } from '../services/auth';
import {
    HiOutlineSearch,
    HiArrowRight,
    HiOutlineTrendingUp,
    HiOutlineLocationMarker,
    HiOutlineSparkles,
    HiOutlineX,
    HiOutlineBell,
    HiUserCircle,
    HiMicrophone
} from 'react-icons/hi';

const categories = [
    { title: 'Beauty', icon: '💅', color: '#ec4899', bg: '#fdf2f8' },
    { title: 'Repairs', icon: '🛠️', color: '#3b82f6', bg: '#eff6ff' },
    { title: 'Electronics', icon: '💻', color: '#8b5cf6', bg: '#f5f3ff' },
    { title: 'Vegetables', icon: '🥦', color: '#10b981', bg: '#ecfdf5' },
    { title: 'Clothes', icon: '👕', color: '#ef4444', bg: '#fef2f2' },
    { title: 'Real Estate', icon: '🏠', color: '#f59e0b', bg: '#fffbeb' },
    { title: 'Grocery', icon: '🛒', color: '#059669', bg: '#ecfdf5' },
    { title: 'Pharmacy', icon: '💊', color: '#ef4444', bg: '#fef2f2' },
];

import { getFallbackImage } from '../utils/imageHelper';

const Home = () => {
    const user = getUser();
    const navigate = useNavigate();

    const [prices, setPrices] = useState([]);
    const [products, setProducts] = useState([]);
    const [services, setServices] = useState([]);
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMoreCats, setShowMoreCats] = useState(false);

    const fetchData = async () => {
        try {
            const [marketRes, prodRes, servRes, noticeRes] = await Promise.all([
                api.get('/market'),
                api.get('/products'),
                api.get('/services'),
                api.get('/notices')
            ]);
            setPrices(marketRes.data.data);
            setProducts(prodRes.data.data);
            setServices(servRes.data.data);
            setNotices(noticeRes.data.data);
        } catch (err) {
            console.error('Failed to fetch home data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const featuredCats = showMoreCats ? categories : categories.slice(0, 8);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <div className="spinner"></div>
        </div>
    );

    return (
        <div className="app-container" style={{ paddingBottom: '40px' }}>

            {/* ── 1. Compact Header ────────────────────── */}
            <header className="header-container">
                <Link to="/dashboard" className="hide-desktop">
                    <HiUserCircle style={{ fontSize: '2.4rem', color: '#6b7280' }} />
                </Link>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0, color: 'var(--primary-color)' }}>Gramzo</h1>
                <Link to="/notices">
                    <HiOutlineBell style={{ fontSize: '2rem', color: '#6b7280' }} />
                </Link>
            </header>

            {/* ── 2. Rounded Search Bar ─────────────────── */}
            <div className="section-spacer" style={{ position: 'relative', maxWidth: '600px', margin: '0 auto 32px' }}>
                <HiOutlineSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '1.2rem' }} />
                <input
                    type="text"
                    placeholder="Search services, products..."
                    style={{ width: '100%', padding: '16px 48px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: '#fff', fontSize: '1rem', boxShadow: 'var(--shadow-sm)' }}
                />
                <HiMicrophone style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-color)', fontSize: '1.2rem' }} />
            </div>

            {/* ── 3. Category Grid ─────────────────────── */}
            <section className="section-spacer">
                <div className="category-grid">
                    {featuredCats.map((cat, i) => (
                        <div key={i} className="cat-item" style={{ textAlign: 'center', cursor: 'pointer' }}>
                            <div className="cat-circle" style={{ backgroundColor: cat.bg, color: cat.color }}>
                                {cat.icon}
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>{cat.title}</span>
                        </div>
                    ))}
                </div>
                {categories.length > 8 && (
                    <button
                        onClick={() => setShowMoreCats(!showMoreCats)}
                        style={{ display: 'block', margin: '24px auto 0', border: 'none', background: 'transparent', color: 'var(--primary-color)', fontWeight: 800, fontSize: '0.9rem' }}
                    >
                        {showMoreCats ? 'Show Less' : 'Show More'}
                    </button>
                )}
            </section>

            {/* ── 4. Quick Action Banner ────────────────── */}
            <section className="section-spacer">
                <div style={{ backgroundColor: '#eff6ff', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #dbeafe', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ flex: 1, minWidth: '240px' }}>
                        <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#1e40af' }}>List your business FREE</h4>
                        <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#3b82f6' }}>Reach thousands of local customers in your neighborhood.</p>
                    </div>
                    <button onClick={() => navigate('/login')} className="btn-primary" style={{ padding: '12px 24px', fontSize: '1rem' }}>
                        Start Now
                    </button>
                </div>
            </section>

            {/* ── 5. Live Market Prices ─────────────────── */}
            <section className="section-spacer">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0 }}>Live Market Prices</h3>
                    <Link to="/prices" style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary-color)' }}>View All</Link>
                </div>
                <div className="responsive-grid-4">
                    {prices.slice(0, 4).map(item => (
                        <div key={item._id} className="standard-card">
                            <div className="card-image-wrapper">
                                <img
                                    src={item.image || getFallbackImage(item.itemName, item.category)}
                                    alt={item.itemName}
                                    onError={(e) => { e.target.src = getFallbackImage(item.itemName, item.category); }}
                                />
                            </div>
                            <div className="card-content">
                                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>{item.itemName}</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary-color)' }}>₹{item.price}</div>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 'auto' }}>{item.location || 'Local Mandi'}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── 6. Popular Services ──────────────────── */}
            <section className="section-spacer">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0 }}>Popular Services</h3>
                    <Link to="/services" style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary-color)' }}>View All</Link>
                </div>
                <div className="responsive-grid">
                    {services.slice(0, 3).map(service => (
                        <div key={service._id} className="standard-card">
                            <div className="card-image-wrapper">
                                <img
                                    src={service.image || getFallbackImage(service.title, service.category?.name)}
                                    alt={service.title}
                                    onError={(e) => { e.target.src = getFallbackImage(service.title, service.category?.name); }}
                                />
                            </div>
                            <div className="card-content">
                                <h4 style={{ fontSize: '1.1rem', margin: '0 0 8px', fontWeight: 800 }}>{service.title}</h4>
                                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--primary-color)', marginBottom: '8px' }}>₹{service.price}</div>
                                <button onClick={() => navigate('/services')} className="btn-secondary" style={{ marginTop: 'auto', width: '100%', justifyContent: 'center' }}>
                                    Book Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── 7. Marketplace Section ───────────────── */}
            <section className="section-spacer">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0 }}>Buy & Sell</h3>
                    <Link to="/marketplace" style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary-color)' }}>View All</Link>
                </div>
                <div className="responsive-grid-4">
                    {products.slice(0, 4).map(product => (
                        <div key={product._id} className="standard-card">
                            <div className="card-image-wrapper">
                                <img
                                    src={product.image || getFallbackImage(product.title, product.category)}
                                    alt={product.title}
                                    onError={(e) => { e.target.src = getFallbackImage(product.title, product.category); }}
                                />
                            </div>
                            <div className="card-content">
                                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>{product.title}</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#111827' }}>₹{product.price}</div>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <HiOutlineLocationMarker /> {product.location}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
};

export default Home;
