import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
    HiOutlineShoppingBag, HiOutlineCalendar, HiOutlinePlusCircle,
    HiOutlineCurrencyRupee, HiOutlineShieldCheck, HiOutlineChartBar,
    HiOutlineSpeakerphone, HiOutlineCollection, HiOutlineUser,
    HiOutlineClock, HiOutlineCheck, HiOutlineX
} from 'react-icons/hi';

const actions = {
    Admin: [
        { to: '/admin', icon: HiOutlineShieldCheck, label: 'Approve Agents', desc: 'Verify and manage agent accounts.', bg: '#eff6ff', color: '#2563eb' },
        { to: '/all-bookings', icon: HiOutlineCollection, label: 'All Bookings', desc: 'Monitor every service request across community.', bg: '#fdf2f8', color: '#db2777' },
        { to: '/notifications', icon: HiOutlineSpeakerphone, label: 'Post Update', desc: 'Broadcast important updates to all users.', bg: '#fff7ed', color: '#ea580c' },
    ],
    Agent: [
        { to: '/services', icon: HiOutlinePlusCircle, label: 'Add Service', desc: 'List your professional services.', bg: '#ecfdf5', color: '#059669' },
        { to: '/agent/marketplace', icon: HiOutlineShoppingBag, label: 'My Marketplace', desc: 'Manage items for sale in local marketplace.', bg: '#fef2f2', color: '#dc2626' },
        { to: '/prices', icon: HiOutlineCurrencyRupee, label: 'Update Prices', desc: 'Manage rates for your services & products.', bg: '#f0f9ff', color: '#0ea5e9' },
        { to: '/my-listings', icon: HiOutlineCollection, label: 'My Listings', desc: 'View and manage your active listings.', bg: '#fef9f0', color: '#d97706' },
        { to: '/earnings', icon: HiOutlineChartBar, label: 'Earnings', desc: 'Track revenue and completed jobs.', bg: '#f5f3ff', color: '#7c3aed' },
    ],
    User: [
        { to: '/services', icon: HiOutlineCalendar, label: 'Browse Services', desc: 'Find and book local experts near you.', bg: '#eff6ff', color: '#2563eb' },
        { to: '/bookings', icon: HiOutlineCollection, label: 'My Bookings', desc: 'View and track all your appointments.', bg: '#ecfdf5', color: '#059669' },
        { to: '/prices', icon: HiOutlineCurrencyRupee, label: 'Market Price', desc: 'Check and update live market rates.', bg: '#f0f9ff', color: '#0ea5e9' },
    ],
};

const Dashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(false);

    useEffect(() => {
        if (user && user.role === 'Agent') {
            fetchBookings();
        }
    }, [user]);

    const fetchBookings = async () => {
        try {
            setLoadingBookings(true);
            const res = await api.get(`/bookings?agentId=${user._id || user.id}`);
            setBookings(res.data.data || []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoadingBookings(false);
        }
    };

    const handleBookingAction = async (bookingId, status) => {
        try {
            await api.patch(`/bookings/${bookingId}/status`, { status });
            // Update local state instantly
            setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status } : b));
        } catch (error) {
            alert('Failed to update booking status');
        }
    };

    if (!user) return null;

    const cards = actions[user.role] || actions.User;

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return { bg: '#fffbeb', color: '#92400e', border: '#fde68a' };
            case 'accepted': return { bg: '#ecfdf5', color: '#059669', border: '#6ee7b7' };
            case 'rejected': return { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' };
            default: return { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' };
        }
    };

    return (
        <div className="page-wrapper">
            {/* Hero header */}
            <header style={{ marginBottom: '40px', paddingBottom: '28px', borderBottom: '1px solid var(--border-color)' }}>
                <div className="section-eyebrow">Dashboard Overview</div>
                <h1 className="section-title">Hey, {user.name}! 👋</h1>
                <p className="section-sub">
                    Welcome back to your <strong>{user.role}</strong> dashboard.
                </p>
            </header>

            <section style={{ marginBottom: '40px' }}>
                <h2 style={{ marginBottom: '20px', fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Quick Actions
                </h2>
                <div className="dash-grid">
                    {cards.map(({ to, icon: Icon, label, desc, bg, color }) => (
                        <Link key={to} to={to} className="dash-card">
                            <div className="dash-card-icon" style={{ backgroundColor: bg, color }}>
                                <Icon />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '4px' }}>{label}</h3>
                                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>{desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {user.role === 'Agent' && (
                <section style={{ marginTop: '48px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>Booking Requests</h2>
                            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Manage your upcoming service appointments</p>
                        </div>
                        <button onClick={fetchBookings} className="btn-refresh-small" title="Refresh Bookings">
                            <HiOutlineClock />
                        </button>
                    </div>

                    {loadingBookings ? (
                        <div className="flex-center" style={{ padding: '40px' }}>
                            <div className="spinner"></div>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="empty-state-mini">
                            <HiOutlineCalendar style={{ fontSize: '2.5rem', opacity: 0.2, marginBottom: '12px' }} />
                            <p>No booking requests found</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                            {bookings.map((booking) => {
                                const statusCfg = getStatusColor(booking.status);
                                return (
                                    <div key={booking._id} className="booking-card-agent">
                                        <div className="booking-card-header">
                                            <div style={{ flex: 1 }}>
                                                <h3 className="booking-service-title">{booking.service?.title || 'Unknown Service'}</h3>
                                                <div className="booking-user-info">
                                                    <HiOutlineUser /> {booking.userName}
                                                </div>
                                            </div>
                                            <span className="status-badge" style={{
                                                backgroundColor: statusCfg.bg,
                                                color: statusCfg.color,
                                                borderColor: statusCfg.border
                                            }}>
                                                {booking.status}
                                            </span>
                                        </div>

                                        <div className="booking-card-details">
                                            <div className="detail-item">
                                                <HiOutlineCalendar />
                                                {new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                {booking.time && ` @ ${booking.time}`}
                                            </div>
                                            <div className="detail-item">
                                                <HiOutlineCurrencyRupee /> ₹{booking.amount}
                                            </div>
                                        </div>

                                        {booking.status === 'pending' && (
                                            <div className="booking-card-actions">
                                                <button
                                                    onClick={() => handleBookingAction(booking._id, 'accepted')}
                                                    className="btn-agent-action accept"
                                                >
                                                    <HiOutlineCheck /> Accept
                                                </button>
                                                <button
                                                    onClick={() => handleBookingAction(booking._id, 'rejected')}
                                                    className="btn-agent-action reject"
                                                >
                                                    <HiOutlineX /> Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            )}

            <style>{`
                .btn-refresh-small {
                    background: none;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    padding: 8px;
                    cursor: pointer;
                    color: var(--text-muted);
                    transition: all 0.2s;
                }
                .btn-refresh-small:hover {
                    background: #f8fafc;
                    color: var(--primary-color);
                }
                .empty-state-mini {
                    text-align: center;
                    padding: 60px 40px;
                    background: #fff;
                    border-radius: 20px;
                    border: 1px dashed var(--border-color);
                    color: var(--text-muted);
                }
                .booking-card-agent {
                    background: #fff;
                    padding: 24px;
                    border-radius: 20px;
                    border: 1px solid var(--border-color);
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .booking-card-agent:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px rgba(0,0,0,0.05);
                }
                .booking-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 20px;
                }
                .booking-service-title {
                    font-size: 1.15rem;
                    font-weight: 800;
                    margin: 0 0 6px 0;
                    letter-spacing: -0.02em;
                }
                .booking-user-info {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.9rem;
                    color: var(--text-muted);
                    font-weight: 600;
                }
                .status-badge {
                    padding: 4px 12px;
                    border-radius: 999px;
                    font-size: 0.75rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    border: 1px solid transparent;
                }
                .booking-card-details {
                    display: flex;
                    gap: 20px;
                    margin-bottom: 24px;
                    padding: 12px 16px;
                    background: #f8fafc;
                    border-radius: 12px;
                }
                .detail-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--text-main);
                }
                .booking-card-actions {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                }
                .btn-agent-action {
                    padding: 12px;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                }
                .btn-agent-action.accept {
                    background: #ecfdf5;
                    color: #10b981;
                }
                .btn-agent-action.accept:hover {
                    background: #10b981;
                    color: #fff;
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                }
                .btn-agent-action.reject {
                    background: #fef2f2;
                    color: #ef4444;
                }
                .btn-agent-action.reject:hover {
                    background: #ef4444;
                    color: #fff;
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
