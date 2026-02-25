import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { demoPrices } from '../services/demoData';
import { getUser } from '../services/auth';
import {
    HiOutlineCalendar,
    HiOutlineShoppingBag,
    HiOutlineSpeakerphone,
    HiOutlineLightningBolt,
    HiArrowRight,
    HiOutlineTrendingUp,
    HiOutlineLocationMarker,
    HiOutlineRefresh,
    HiOutlineX
} from 'react-icons/hi';

const features = [
    {
        icon: HiOutlineCalendar,
        title: 'Book Local Services',
        desc: 'Find electricians, plumbers, and agricultural experts in your village within minutes.',
        accent: '#2563eb',
        bg: '#eff6ff',
        link: '/services',
        cta: 'Browse Services'
    },
    {
        icon: HiOutlineShoppingBag,
        title: 'Village Marketplace',
        desc: 'Buy and sell fresh produce, handmade goods, and everyday items from your community.',
        accent: '#ea580c',
        bg: '#fff7ed',
        link: '/marketplace',
        cta: 'Visit Marketplace'
    },
    {
        icon: HiOutlineSpeakerphone,
        title: 'Community Notices',
        desc: 'Stay updated with alerts, government schemes, and local announcements in real time.',
        accent: '#7c3aed',
        bg: '#f5f3ff',
        link: '/notices',
        cta: 'Read Notices'
    }
];

const Home = () => {
    const user = getUser();
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [newPrice, setNewPrice] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchPrices = async () => {
        try {
            const response = await api.get('/market');
            const data = response.data.data;
            setPrices(data.length > 0 ? data : demoPrices);
        } catch (err) {
            console.error('Failed to fetch market prices');
            setPrices(demoPrices);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrices();
    }, []);

    const openUpdateModal = (item) => {
        setSelectedItem(item);
        setNewPrice(item.price);
        setShowUpdateModal(true);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!newPrice || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await api.post('/market/add', {
                itemName: selectedItem.itemName,
                category: selectedItem.category,
                location: selectedItem.location,
                image: selectedItem.imageUrl || selectedItem.image,
                price: Number(newPrice),
                updatedBy: user?.name || 'Guest User',
                role: (user?.role?.toLowerCase() === 'agent' ? 'agent' : 'user')
            });
            await fetchPrices(); // Refresh UI
            setShowUpdateModal(false);
        } catch (err) {
            console.error('Failed to update price');
            alert('Failed to update price. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ backgroundColor: 'var(--bg-color)' }}>

            {/* ── Hero ──────────────────────────────────── */}
            <section style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)',
                padding: '88px 24px 80px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* decorative blobs */}
                <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '240px', height: '240px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.15)', color: '#bfdbfe', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '6px 14px', borderRadius: '999px', marginBottom: '24px' }}>
                        <HiOutlineLightningBolt /> Gramzo Platform
                    </div>

                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '900', color: '#fff', letterSpacing: '-0.04em', margin: '0 0 20px', lineHeight: 1.1 }}>
                        Connecting Villages to the Digital Economy
                    </h1>

                    <p style={{ fontSize: '1.15rem', color: '#bfdbfe', lineHeight: 1.7, margin: '0 0 40px', maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto' }}>
                        Book trusted local services, trade community goods, and stay informed — all in one platform built for Bharat.
                    </p>

                    <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {user ? (
                            <Link to="/dashboard" style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                backgroundColor: '#fff', color: 'var(--primary-color)',
                                padding: '14px 28px', borderRadius: '12px',
                                fontWeight: '800', fontSize: '1rem',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                                textDecoration: 'none', transition: 'var(--transition)'
                            }}>
                                Go to Dashboard <HiArrowRight />
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    backgroundColor: '#fff', color: 'var(--primary-color)',
                                    padding: '14px 28px', borderRadius: '12px',
                                    fontWeight: '800', fontSize: '1rem',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                                    textDecoration: 'none', transition: 'var(--transition)'
                                }}>
                                    Sign In <HiArrowRight />
                                </Link>
                                <Link to="/signup" style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff',
                                    border: '1.5px solid rgba(255,255,255,0.35)',
                                    padding: '14px 28px', borderRadius: '12px',
                                    fontWeight: '700', fontSize: '1rem',
                                    textDecoration: 'none', transition: 'var(--transition)'
                                }}>
                                    Create Account
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Stats Strip ───────────────────────────── */}
            <section style={{ backgroundColor: '#fff', borderBottom: '1px solid var(--border-color)', padding: '28px 24px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', textAlign: 'center' }}>
                    {[
                        { value: '500+', label: 'Villages Served' },
                        { value: '2,000+', label: 'Verified Agents' },
                        { value: '10,000+', label: 'Bookings Made' }
                    ].map(stat => (
                        <div key={stat.label}>
                            <div style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--primary-color)', letterSpacing: '-0.04em' }}>{stat.value}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '4px' }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Features ──────────────────────────────── */}
            <section style={{ padding: '72px 24px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '52px' }}>
                    <div className="section-eyebrow">What We Offer</div>
                    <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: '900', margin: '8px 0 14px', letterSpacing: '-0.03em' }}>
                        Everything your community needs
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto' }}>
                        One platform covering services, goods, and community updates for rural India.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    {features.map(f => (
                        <div key={f.title} className="card hover-lift" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '32px' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: f.bg, color: f.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.7rem' }}>
                                <f.icon />
                            </div>
                            <div>
                                <h3 style={{ margin: '0 0 10px', fontSize: '1.2rem', fontWeight: '800' }}>{f.title}</h3>
                                <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: 1.65, fontSize: '0.95rem' }}>{f.desc}</p>
                            </div>
                            <Link to={f.link} style={{
                                marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '6px',
                                color: f.accent, fontWeight: '700', fontSize: '0.9rem', textDecoration: 'none'
                            }}>
                                {f.cta} <HiArrowRight />
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Market Prices ────────────────────────── */}
            <section style={{ padding: '0 24px 72px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <div className="section-eyebrow">Real-time Updates</div>
                        <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: '900', margin: '8px 0 0', letterSpacing: '-0.03em' }}>
                            Live Market Prices
                        </h2>
                    </div>
                    <button
                        onClick={() => fetchPrices()}
                        className="btn-ghost"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <HiOutlineRefresh className={loading ? 'spinner' : ''} /> Refresh List
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
                        <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
                        Fetching latest market data...
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
                        {prices.map(item => (
                            <div key={item._id} className="card hover-lift" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ height: '160px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                                    <img
                                        src={item.imageUrl || item.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                                        alt={item.itemName}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div style={{
                                        position: 'absolute', top: '12px', left: '12px',
                                        backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff',
                                        padding: '4px 10px', borderRadius: '6px',
                                        fontSize: '0.75rem', fontWeight: '700', backdropFilter: 'blur(4px)'
                                    }}>
                                        {item.category}
                                    </div>
                                </div>
                                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800' }}>{item.itemName}</h3>
                                        <div style={{ color: 'var(--primary-color)', fontWeight: '900', fontSize: '1.25rem' }}>
                                            ₹{item.price}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
                                        <HiOutlineLocationMarker /> {item.location}
                                    </div>
                                    <button
                                        onClick={() => openUpdateModal(item)}
                                        className="btn-primary"
                                        style={{
                                            width: '100%', marginTop: 'auto',
                                            padding: '10px', fontSize: '0.9rem',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                        }}
                                    >
                                        <HiOutlineTrendingUp /> Update Price
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ── Update Modal ────────────────────────── */}
            {showUpdateModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, padding: '20px'
                }}>
                    <div className="card" style={{ width: '400px', padding: '32px', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                        <button
                            onClick={() => setShowUpdateModal(false)}
                            style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.5rem' }}
                        >
                            <HiOutlineX />
                        </button>

                        <h3 style={{ margin: '0 0 8px', fontSize: '1.25rem', fontWeight: '900' }}>Update Market Price</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
                            Contribute to the community by correcting the price of <strong>{selectedItem?.itemName}</strong>.
                        </p>

                        <form onSubmit={handleUpdateSubmit}>
                            <div className="form-group" style={{ marginBottom: '24px' }}>
                                <label className="form-label">New Price (₹)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={newPrice}
                                    onChange={(e) => setNewPrice(e.target.value)}
                                    autoFocus
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn-primary"
                                style={{ width: '100%', padding: '12px' }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <><HiOutlineRefresh className="spinner" /> Updating...</> : 'Confirm Update'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ── CTA Banner ────────────────────────────── */}
            {!user && (
                <section style={{ padding: '0 24px 80px' }}>
                    <div style={{
                        maxWidth: '900px', margin: '0 auto',
                        background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
                        borderRadius: '24px', padding: '56px 48px', textAlign: 'center',
                        boxShadow: '0 20px 40px rgba(37,99,235,0.25)'
                    }}>
                        <h2 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', margin: '0 0 14px', fontWeight: '900', letterSpacing: '-0.03em' }}>
                            Join 10,000+ community members today
                        </h2>
                        <p style={{ color: '#bfdbfe', margin: '0 0 32px', fontSize: '1.05rem' }}>
                            Sign up in seconds. No passwords. Just your name and phone.
                        </p>
                        <Link to="/signup" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            backgroundColor: '#fff', color: 'var(--primary-color)',
                            padding: '14px 32px', borderRadius: '12px',
                            fontWeight: '800', fontSize: '1rem', textDecoration: 'none',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                        }}>
                            Get Started Free <HiArrowRight />
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
