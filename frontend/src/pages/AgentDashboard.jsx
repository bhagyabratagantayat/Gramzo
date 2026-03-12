import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
    HiOutlineShoppingBag,
    HiOutlineCalendar,
    HiOutlinePlusCircle,
    HiOutlineCurrencyRupee,
    HiOutlineChartBar,
    HiOutlineClock,
    HiOutlineCheck,
    HiOutlineX,
    HiOutlineCollection,
    HiOutlineUserGroup,
    HiOutlineTrendingUp,
    HiOutlineSpeakerphone
} from 'react-icons/hi';

const AgentDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalEarnings: 0,
        activeListings: 0,
        pendingBookings: 0,
        completedBookings: 0
    });
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [summaryRes, bookingsRes] = await Promise.all([
                api.get('/agent/dashboard'),
                api.get('/agent/bookings')
            ]);

            setStats(summaryRes.data.data || stats);
            setRecentBookings(bookingsRes.data.data?.slice(0, 5) || []);
        } catch (error) {
            console.error('Error fetching agent dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleBookingAction = async (id, status) => {
        try {
            await api.patch(`/bookings/respond/${id}`, { status });
            fetchDashboardData();
        } catch (error) {
            alert('Action failed');
        }
    };

    if (loading) return <div className="flex-center" style={{ height: '60vh' }}><div className="spinner"></div></div>;

    return (
        <div className="page-wrapper dashboard-agent">
            <header className="dash-header">
                <div>
                    <div className="section-eyebrow">Professional Dashboard</div>
                    <h1 className="section-title">Welcome back, {user?.name.split(' ')[0]}!</h1>
                    <p className="section-sub">Here's what's happening with your business today.</p>
                </div>
                <div className="header-actions">
                    <Link to="/services" className="btn-primary">
                        <HiOutlinePlusCircle /> Add Service
                    </Link>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card premium">
                    <div className="stat-icon earnings"><HiOutlineCurrencyRupee /></div>
                    <div className="stat-content">
                        <span className="label">Total Earnings</span>
                        <h3 className="value">₹{stats.totalEarnings?.toLocaleString() || '0'}</h3>
                        <span className="trend positive"><HiOutlineTrendingUp /> +12% this month</span>
                    </div>
                </div>
                <div className="stat-card premium">
                    <div className="stat-icon listings"><HiOutlineCollection /></div>
                    <div className="stat-content">
                        <span className="label">Active Listings</span>
                        <h3 className="value">{stats.activeListings || '0'}</h3>
                        <span className="trend positive">Manage all items</span>
                    </div>
                </div>
                <div className="stat-card premium">
                    <div className="stat-icon pending"><HiOutlineClock /></div>
                    <div className="stat-content">
                        <span className="label">Pending Bookings</span>
                        <h3 className="value">{stats.pendingBookings || '0'}</h3>
                        <span className="trend warning">Requires action</span>
                    </div>
                </div>
                <div className="stat-card premium">
                    <div className="stat-icon completed"><HiOutlineCheck /></div>
                    <div className="stat-content">
                        <span className="label">Jobs Completed</span>
                        <h3 className="value">{stats.completedBookings || '0'}</h3>
                        <span className="trend neutral">Great job!</span>
                    </div>
                </div>
            </div>

            <div className="dash-main-content">
                {/* Recent Bookings Section */}
                <div className="content-card">
                    <div className="card-header">
                        <h2>Recent Booking Requests</h2>
                        <Link to="/bookings" className="view-all">View All</Link>
                    </div>
                    <div className="bookings-list">
                        {recentBookings.length === 0 ? (
                            <div className="empty-state-card">No recent bookings</div>
                        ) : (
                            recentBookings.map(booking => (
                                <div key={booking._id} className="booking-row">
                                    <div className="user-info">
                                        <div className="avatar-mini">{booking.userName[0]}</div>
                                        <div>
                                            <div className="name">{booking.userName}</div>
                                            <div className="service">{booking.service?.title}</div>
                                        </div>
                                    </div>
                                    <div className="booking-meta">
                                        <div className="date">{new Date(booking.date).toLocaleDateString()}</div>
                                        <div className="amount">₹{booking.amount}</div>
                                    </div>
                                    <div className="actions">
                                        {booking.status === 'pending' ? (
                                            <>
                                                <button onClick={() => handleBookingAction(booking._id, 'accepted')} className="btn-icon accept"><HiOutlineCheck /></button>
                                                <button onClick={() => handleBookingAction(booking._id, 'rejected')} className="btn-icon reject"><HiOutlineX /></button>
                                            </>
                                        ) : (
                                            <span className={`status-tag ${booking.status}`}>{booking.status}</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="shortcuts-panel">
                    <h3>Quick Shortcuts</h3>
                    <div className="shortcut-grid">
                        <Link to="/agent/marketplace" className="shortcut-btn">
                            <HiOutlineShoppingBag /> Marketplace
                        </Link>
                        <Link to="/earnings" className="shortcut-btn">
                            <HiOutlineChartBar /> Revenue Details
                        </Link>
                        <Link to="/prices" className="shortcut-btn">
                            <HiOutlineCurrencyRupee /> Set Rates
                        </Link>
                        <Link to="/notifications" className="shortcut-btn">
                            <HiOutlineSpeakerphone /> Notifications
                        </Link>
                    </div>
                </div>
            </div>

            <style>{`
                .dashboard-agent { padding-top: 20px; }
                .stats-grid { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); 
                    gap: 20px; 
                    margin-bottom: 32px; 
                }
                .stat-card.premium {
                    background: #fff;
                    border-radius: 20px;
                    padding: 24px;
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    border: 1px solid var(--border-color);
                    transition: all 0.3s ease;
                }
                .stat-card.premium:hover {
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                    transform: translateY(-5px);
                }
                .stat-icon {
                    width: 56px; height: 56px; border-radius: 16px;
                    display: flex; alignItems: center; justifyContent: center;
                    font-size: 1.5rem;
                }
                .stat-icon.earnings { background: #ecfdf5; color: #10b981; }
                .stat-icon.listings { background: #eff6ff; color: #3b82f6; }
                .stat-icon.pending { background: #fff7ed; color: #f59e0b; }
                .stat-icon.completed { background: #f5f3ff; color: #8b5cf6; }

                .stat-content .label { font-size: 0.85rem; color: var(--text-muted); font-weight: 600; }
                .stat-content .value { font-size: 1.5rem; font-weight: 800; margin: 4px 0; }
                .stat-content .trend { font-size: 0.75rem; font-weight: 700; display: flex; alignItems: center; gap: 4px; }
                .trend.positive { color: #10b981; }
                .trend.warning { color: #f59e0b; }
                .trend.neutral { color: var(--text-muted); }

                .dash-main-content {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 32px;
                }
                @media (max-width: 900px) { .dash-main-content { grid-template-columns: 1fr; } }

                .content-card {
                    background: #fff; border-radius: 24px; border: 1px solid var(--border-color);
                    padding: 24px;
                }
                .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
                .card-header h2 { font-size: 1.25rem; font-weight: 800; margin: 0; }
                .view-all { color: var(--primary-color); font-weight: 700; font-size: 0.9rem; }

                .booking-row {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 16px 0; border-bottom: 1px solid var(--border-color);
                }
                .booking-row:last-child { border-bottom: none; }
                .user-info { display: flex; gap: 12px; align-items: center; }
                .avatar-mini { width: 36px; height: 36px; border-radius: 10px; background: #f1f5f9; display: flex; alignItems: center; justifyContent: center; font-weight: 800; color: #64748b; }
                .user-info .name { font-weight: 700; font-size: 0.95rem; }
                .user-info .service { font-size: 0.8rem; color: var(--text-muted); }

                .booking-meta { text-align: right; }
                .booking-meta .date { font-size: 0.8rem; color: var(--text-muted); }
                .booking-meta .amount { font-weight: 700; color: var(--text-main); }

                .actions { display: flex; gap: 8px; }
                .btn-icon { width: 32px; height: 32px; border-radius: 8px; border: none; cursor: pointer; display: flex; alignItems: center; justifyContent: center; transition: all 0.2s; }
                .btn-icon.accept { background: #ecfdf5; color: #10b981; }
                .btn-icon.accept:hover { background: #10b981; color: #fff; }
                .btn-icon.reject { background: #fef2f2; color: #ef4444; }
                .btn-icon.reject:hover { background: #ef4444; color: #fff; }

                .status-tag { padding: 4px 10px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; text-transform: capitalize; }
                .status-tag.accepted { background: #eff6ff; color: #2563eb; }
                .status-tag.rejected { background: #fff1f2; color: #e11d48; }

                .shortcuts-panel h3 { font-size: 1.1rem; font-weight: 800; margin-bottom: 20px; }
                .shortcut-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
                .shortcut-btn {
                    background: #fff; border: 1px solid var(--border-color); border-radius: 16px;
                    padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 10px;
                    font-size: 0.85rem; font-weight: 700; color: var(--text-main); transition: all 0.2s;
                }
                .shortcut-btn svg { font-size: 1.5rem; color: var(--primary-color); }
                .shortcut-btn:hover { border-color: var(--primary-color); color: var(--primary-color); background: #f0f9ff; }
            `}</style>
        </div>
    );
};

export default AgentDashboard;
