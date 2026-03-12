import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
    HiOutlineShoppingBag,
    HiOutlineCalendar,
    HiOutlineBell,
    HiOutlineInformationCircle,
    HiOutlineArrowRight,
    HiOutlineUser
} from 'react-icons/hi';

const UserDashboard = () => {
    const { user } = useAuth();
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/user/dashboard'); // Custom endpoint for unified user summary
                setRecentBookings(res.data.data?.recentBookings || []);
            } catch (err) {
                console.error('Failed to fetch user dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="flex-center" style={{ height: '60vh' }}><div className="spinner"></div></div>;

    return (
        <div className="page-wrapper dashboard-user">
            <header className="dash-header">
                <div className="user-profile-hero">
                    <div className="hero-avatar"><HiOutlineUser /></div>
                    <div>
                        <h1 className="section-title">Happy Day, {user?.name.split(' ')[0]}!</h1>
                        <p className="section-sub">Here's a look at your community activity.</p>
                    </div>
                </div>
            </header>

            <div className="user-dash-grid">
                {/* Bookings Section */}
                <div className="dash-section">
                    <div className="section-header">
                        <h2>Your Booked Services</h2>
                        <Link to="/bookings" className="link-more">View History <HiOutlineArrowRight /></Link>
                    </div>
                    <div className="dash-scroller">
                        {recentBookings.length === 0 ? (
                            <div className="empty-card">
                                <HiOutlineCalendar />
                                <p>No active bookings yet.</p>
                                <Link to="/services" className="btn-text">Explore Services</Link>
                            </div>
                        ) : (
                            recentBookings.map(b => (
                                <div key={b._id} className="booking-mini-card">
                                    <div className="status-indicator" data-status={b.status}></div>
                                    <div className="card-info">
                                        <h4>{b.service?.title}</h4>
                                        <p>{new Date(b.date).toLocaleDateString()} • {b.status}</p>
                                    </div>
                                    <div className="amount">₹{b.amount}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Hub */}
                <div className="quick-hub">
                    <h2 className="section-title-mini">Community Hub</h2>
                    <div className="hub-grid">
                        <Link to="/marketplace" className="hub-card purple">
                            <HiOutlineShoppingBag />
                            <span>Marketplace</span>
                        </Link>
                        <Link to="/prices" className="hub-card blue">
                            <HiOutlineInformationCircle />
                            <span>Market Prices</span>
                        </Link>
                        <Link to="/notifications" className="hub-card orange">
                            <HiOutlineBell />
                            <span>Help & Alerts</span>
                        </Link>
                    </div>

                    <div className="promo-banner">
                        <div className="banner-text">
                            <h4>Support Local Agents</h4>
                            <p>Book verified experts from your community.</p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .user-profile-hero { display: flex; align-items: center; gap: 20px; margin-bottom: 32px; }
                .hero-avatar { width: 64px; height: 64px; border-radius: 20px; background: #eff6ff; color: #3b82f6; display: flex; alignItems: center; justifyContent: center; font-size: 2rem; }
                
                .user-dash-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 32px; }
                @media (max-width: 800px) { .user-dash-grid { grid-template-columns: 1fr; } }

                .dash-section h2 { font-size: 1.25rem; font-weight: 800; margin: 0; }
                .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .link-more { display: flex; align-items: center; gap: 6px; font-weight: 700; color: var(--primary-color); font-size: 0.9rem; }

                .booking-mini-card {
                    background: #fff; border: 1px solid var(--border-color); border-radius: 16px;
                    padding: 16px; display: flex; align-items: center; gap: 16px; margin-bottom: 12px;
                    transition: transform 0.2s;
                }
                .booking-mini-card:hover { transform: scale(1.02); border-color: var(--primary-color); }
                .status-indicator { width: 4px; height: 32px; border-radius: 2px; }
                .status-indicator[data-status="pending"] { background: #f59e0b; }
                .status-indicator[data-status="accepted"] { background: #10b981; }
                .status-indicator[data-status="completed"] { background: #3b82f6; }

                .card-info h4 { margin: 0; font-size: 1rem; font-weight: 700; }
                .card-info p { margin: 2px 0 0 0; font-size: 0.8rem; color: var(--text-muted); text-transform: capitalize; }
                .amount { margin-left: auto; font-weight: 800; color: var(--text-main); }

                .section-title-mini { font-size: 1.1rem; font-weight: 800; margin-bottom: 20px; }
                .hub-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
                .hub-card {
                    padding: 20px; border-radius: 20px; display: flex; flex-direction: column; gap: 10px;
                    font-weight: 700; font-size: 0.9rem; color: #fff; transition: opacity 0.2s;
                }
                .hub-card svg { font-size: 1.5rem; }
                .hub-card.purple { background: linear-gradient(135deg, #a855f7, #7c3aed); }
                .hub-card.blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
                .hub-card.orange { background: linear-gradient(135deg, #f97316, #ea580c); grid-column: span 2; }
                .hub-card:hover { opacity: 0.9; }

                .promo-banner {
                    background: #f8fafc; border: 1px dashed var(--border-color); border-radius: 20px;
                    padding: 24px; margin-top: 12px;
                }
                .promo-banner h4 { margin: 0; font-size: 0.95rem; font-weight: 800; }
                .promo-banner p { margin: 4px 0 0 0; font-size: 0.85rem; color: var(--text-muted); }

                .empty-card {
                    background: #fff; border: 1px dashed var(--border-color); border-radius: 20px;
                    padding: 48px 24px; text-align: center; color: var(--text-muted);
                }
                .empty-card svg { font-size: 2.5rem; margin-bottom: 12px; opacity: 0.3; }
                .btn-text { display: block; margin-top: 12px; color: var(--primary-color); font-weight: 700; }
            `}</style>
        </div>
    );
};

export default UserDashboard;
