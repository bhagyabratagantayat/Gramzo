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
    HiOutlineCurrencyRupee,
    HiOutlineShieldCheck,
    HiOutlineClock,
    HiOutlineScissors,
    HiOutlineCog,
    HiOutlineDesktopComputer,
    HiOutlineHome,
    HiOutlineShoppingBag,
    HiOutlineBell
} from 'react-icons/hi';

const categories = [
    { title: 'Beauty', icon: <HiOutlineScissors />, color: '#ec4899', bg: '#fdf2f8' },
    { title: 'Repairs', icon: <HiOutlineCog />, color: '#3b82f6', bg: '#eff6ff' },
    { title: 'Electronics', icon: <HiOutlineDesktopComputer />, color: '#8b5cf6', bg: '#f5f3ff' },
    { title: 'Vegetables', icon: '🥦', color: '#10b981', bg: '#ecfdf5' },
    { title: 'Clothes', icon: <HiOutlineShoppingBag />, color: '#ef4444', bg: '#fef2f2' },
    { title: 'Real Estate', icon: <HiOutlineHome />, color: '#f59e0b', bg: '#fffbeb' },
];

const Home = () => {
    const user = getUser();
    const navigate = useNavigate();

    // Data states
    const [prices, setPrices] = useState([]);
    const [products, setProducts] = useState([]);
    const [services, setServices] = useState([]);
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    // Search & Filter state for Market Section
    const [marketSearch, setMarketSearch] = useState('');
    const [activeMarketCat, setActiveMarketCat] = useState('All');

    // Global Search
    const [globalSearch, setGlobalSearch] = useState('');

    // Price Update Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [newPrice, setNewPrice] = useState('');
    const [updating, setUpdating] = useState(false);

    const fetchData = async () => {
        try {
            const [marketRes, prodRes, servRes, noticeRes] = await Promise.all([
                api.get('/market'),
                api.get('/products'),
                api.get('/services'),
                api.get('/notices')
            ]);
            setPrices(marketRes.data.data);
            setProducts(prodRes.data.data.slice(0, 4));
            setServices(servRes.data.data.slice(0, 4));
            setNotices(noticeRes.data.data.slice(0, 3));
        } catch (err) {
            console.error('Failed to fetch home data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleGlobalSearch = (e) => {
        e.preventDefault();
        if (globalSearch) {
            navigate(`/marketplace?search=${encodeURIComponent(globalSearch)}`);
        }
    };

    const marketCategories = useMemo(() => {
        const cats = prices.map(p => p.category).filter(Boolean);
        return ['All', ...new Set(cats)];
    }, [prices]);

    const filteredPrices = useMemo(() => {
        let result = prices;
        if (activeMarketCat !== 'All') {
            result = result.filter(p => p.category === activeMarketCat);
        }
        if (marketSearch) {
            result = result.filter(p => p.itemName.toLowerCase().includes(marketSearch.toLowerCase()));
        }
        return result.slice(0, 8); // Limit home display
    }, [prices, activeMarketCat, marketSearch]);

    const openUpdateModal = (item) => {
        setSelectedItem(item);
        setNewPrice(item.price);
        setShowModal(true);
    };

    const handleUpdatePrice = async (e) => {
        e.preventDefault();
        if (!user) return navigate('/login');
        setUpdating(true);
        try {
            await api.post('/market/update', {
                itemId: selectedItem._id,
                newPrice: Number(newPrice),
                updatedBy: user.name,
                role: user.role
            });
            setShowModal(false);
            fetchData();
        } catch (err) {
            alert('Failed to update price');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', gap: '20px' }}>
            <div className="home-spinner" style={{ width: '50px', height: '50px', border: '5px solid #f3f4f6', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: '#64748b', fontWeight: '600' }}>Crafting your community experience...</p>
        </div>
    );

    return (
        <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh' }}>

            {/* ── 1. Hero Section ────────────────────────── */}
            <section style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                padding: '120px 20px 160px',
                textAlign: 'center',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '100px', marginBottom: '32px', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.9rem', fontWeight: '700' }}>
                        <HiOutlineSparkles style={{ color: '#fbbf24' }} /> Gramzo: Bharat's Modern Mandi
                    </div>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: '900', letterSpacing: '-0.04em', lineHeight: 1, margin: '0 0 24px' }}>
                        Find Local Services & <br /> <span style={{ color: '#bfdbfe' }}>Live Market Prices</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#bfdbfe', margin: '0 0 48px', maxWidth: '650px', marginInline: 'auto' }}>
                        Book services, explore marketplace, and check real-time prices in your own local language and region.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                        <button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} style={{ padding: '20px 48px', backgroundColor: '#fff', color: '#2563eb', borderRadius: '18px', fontWeight: '900', border: 'none', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                            Explore Now
                        </button>
                    </div>
                </div>
                {/* Decorative blobs */}
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)', borderRadius: '50%' }} />
            </section>

            {/* ── 2. Category Grid Section ────────────────────────── */}
            <section style={{ maxWidth: '1400px', margin: '-80px auto 80px', padding: '0 20px', position: 'relative', zIndex: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
                    {categories.map((cat, idx) => (
                        <div key={idx} style={{
                            backgroundColor: '#fff',
                            padding: '30px 20px',
                            borderRadius: '30px',
                            textAlign: 'center',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                            border: '1px solid #e5e7eb',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer'
                        }} className="cat-card">
                            <style>{`.cat-card:hover { transform: translateY(-8px); border-color: #2563eb; }`}</style>
                            <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: cat.bg, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.8rem' }}>
                                {cat.icon}
                            </div>
                            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#1f2937', margin: 0 }}>{cat.title}</h3>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── 3. Live Market Price (MAIN USP) ────────────────────────── */}
            <section style={{ maxWidth: '1400px', margin: '0 auto 100px', padding: '0 20px' }}>
                <div style={{ backgroundColor: '#fff', borderRadius: '40px', padding: '60px 40px', boxShadow: '0 20px 50px rgba(0,0,0,0.03)', border: '1px solid #e5e7eb' }}>
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#059669', fontWeight: '800', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                            <span style={{ width: '10px', height: '10px', backgroundColor: '#10b981', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span> LIVE MARKET RATES
                        </div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.02em' }}>Live Market Prices Near You</h2>
                    </div>

                    {/* Market Filter Bar */}
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', flexWrap: 'wrap', position: 'sticky', top: '20px', zIndex: 30, backgroundColor: '#fff', padding: '10px 0' }}>
                        <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
                            <HiOutlineSearch style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '1.2rem' }} />
                            <input
                                type="text"
                                placeholder="Search commodity..."
                                value={marketSearch}
                                onChange={(e) => setMarketSearch(e.target.value)}
                                style={{ width: '100%', padding: '16px 20px 16px 56px', borderRadius: '18px', border: '2.5px solid #f3f4f6', outline: 'none', fontSize: '1.1rem', fontWeight: '600' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px', scrollbarWidth: 'none' }} className="no-scrollbar">
                            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                            {marketCategories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveMarketCat(cat)}
                                    style={{
                                        padding: '14px 28px',
                                        borderRadius: '100px',
                                        border: 'none',
                                        backgroundColor: activeMarketCat === cat ? '#2563eb' : '#f3f4f6',
                                        color: activeMarketCat === cat ? '#fff' : '#64748b',
                                        fontWeight: '800',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                        transition: '0.2s'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                        {filteredPrices.map((item, idx) => (
                            <div key={item._id} style={{ borderRadius: '28px', overflow: 'hidden', backgroundColor: '#fff', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: '0.3s' }} className="market-card">
                                <style>{`.market-card:hover { transform: scale(1.02); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }`}</style>
                                <div style={{ height: '200px', position: 'relative' }}>
                                    <img src={item.image} alt={item.itemName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.src = `https://via.placeholder.com/400x300?text=${item.itemName}`} />
                                    {idx < 2 && (
                                        <div style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: '#ef4444', color: '#fff', padding: '6px 14px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            🔥 Trending
                                        </div>
                                    )}
                                    <div style={{ position: 'absolute', bottom: '15px', left: '15px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '6px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800', backdropFilter: 'blur(5px)' }}>
                                        {item.location || 'Local Mandi'}
                                    </div>
                                </div>
                                <div style={{ padding: '24px' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>{item.category}</div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#111827', margin: '0 0 16px 0' }}>{item.itemName}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                            <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#111827' }}>₹{item.price}</span>
                                            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>/ unit</span>
                                        </div>
                                        <button
                                            onClick={() => openUpdateModal(item)}
                                            style={{ backgroundColor: '#2563eb', color: '#fff', borderRadius: '12px', border: 'none', padding: '10px 18px', fontWeight: '800', cursor: 'pointer', fontSize: '0.85rem' }}
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 4. Popular Services ────────────────────────── */}
            <section style={{ maxWidth: '1400px', margin: '0 auto 100px', padding: '0 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                    <div>
                        <div style={{ color: '#2563eb', fontWeight: '800', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px' }}>EXPERT ASSISTANCE</div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#111827', margin: 0 }}>Popular Services</h2>
                    </div>
                    <Link to="/services" style={{ color: '#2563eb', fontWeight: '800', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Browse All Services <HiArrowRight />
                    </Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                    {services.map(service => (
                        <div key={service._id} style={{ backgroundColor: '#fff', borderRadius: '32px', overflow: 'hidden', border: '1px solid #e5e7eb', transition: '0.3s' }} className="service-card">
                            <style>{`.service-card:hover { transform: translateY(-10px); box-shadow: 0 30px 60px rgba(0,0,0,0.1); }`}</style>
                            <div style={{ height: '220px' }}>
                                <img src={service.image} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.src = 'https://via.placeholder.com/400x300'} />
                            </div>
                            <div style={{ padding: '28px' }}>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#111827', margin: '0 0 12px 0' }}>{service.title}</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#2563eb' }}>₹{service.price}</div>
                                    <button onClick={() => navigate('/services')} style={{ padding: '12px 24px', borderRadius: '14px', border: 'none', backgroundColor: '#111827', color: '#fff', fontWeight: '800', cursor: 'pointer' }}>
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── 5. Marketplace Section ────────────────────────── */}
            <section style={{ maxWidth: '1400px', margin: '0 auto 100px', padding: '0 20px' }}>
                <div style={{ backgroundColor: '#fff', borderRadius: '40px', padding: '60px 40px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#111827', margin: 0 }}>Buy & Sell Products</h2>
                        <Link to="/marketplace" style={{ padding: '14px 28px', backgroundColor: '#f3f4f6', color: '#1f2937', fontWeight: '800', borderRadius: '14px', textDecoration: 'none' }}>Visit Marketplace</Link>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                        {products.map(product => (
                            <div key={product._id} style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                                <div style={{ height: '200px' }}>
                                    <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ padding: '20px' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#111827', margin: '0 0 8px 0' }}>{product.title}</h3>
                                    <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#111827', marginBottom: '12px' }}>₹{product.price}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <HiOutlineLocationMarker /> {product.location}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 6. Latest Updates (Notices) ────────────────────────── */}
            <section style={{ maxWidth: '1400px', margin: '0 auto 100px', padding: '0 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#111827', margin: 0 }}>Latest Updates</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '800px', margin: '0 auto' }}>
                    {notices.map(notice => (
                        <div key={notice._id} style={{ backgroundColor: '#fff', padding: '24px 32px', borderRadius: '24px', border: '1px solid #e5e7eb', display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                                <HiOutlineBell />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#111827', margin: '0 0 4px 0' }}>{notice.title}</h4>
                                <p style={{ fontSize: '0.95rem', color: '#6b7280', margin: 0 }}>{notice.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── 7. Price Update Modal ────────────────────────── */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '420px', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                        <div style={{ padding: '30px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '900', margin: 0 }}>Update Market Price</h3>
                            <button onClick={() => setShowModal(false)} style={{ border: 'none', background: '#f3f4f6', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}><HiOutlineX /></button>
                        </div>
                        <form onSubmit={handleUpdatePrice} style={{ padding: '40px' }}>
                            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#2563eb', marginBottom: '8px' }}>{selectedItem.category}</div>
                                <h4 style={{ fontSize: '1.5rem', fontWeight: '900', margin: 0 }}>{selectedItem.itemName}</h4>
                                <div style={{ marginTop: '6px', color: '#6b7280' }}>Current Price: ₹{selectedItem.price}</div>
                            </div>
                            <div style={{ marginBottom: '32px' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '800', marginBottom: '12px' }}>New Price per unit</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', fontWeight: '900', color: '#9ca3af' }}>₹</span>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={newPrice}
                                        onChange={(e) => setNewPrice(e.target.value)}
                                        style={{ width: '100%', padding: '18px 20px 18px 45px', borderRadius: '16px', border: '2.5px solid #f3f4f6', fontSize: '1.3rem', fontWeight: '900', outline: 'none' }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: '#f3f4f6', color: '#4b5563', fontWeight: '800' }}>Cancel</button>
                                <button type="submit" disabled={updating} style={{ flex: 2, padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: '#2563eb', color: '#fff', fontWeight: '900' }}>
                                    {updating ? 'Updating...' : 'Set Rate'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Home;
