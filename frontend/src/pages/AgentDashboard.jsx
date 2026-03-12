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
        <div className="agent-dashboard-container app-container py-8">
            <header className="dash-header">
                <div className="dash-title-group">
                    <div className="dash-eyebrow">Professional Dashboard</div>
                    <h1 className="dash-title">Welcome back, {user?.name.split(' ')[0]}!</h1>
                    <p className="dash-subtitle">Here's what's happening with your business today.</p>
                </div>
                <div className="header-actions">
                    <Link to="/services" className="btn-primary flex items-center gap-2 py-3 px-6 rounded-2xl">
                        <HiOutlinePlusCircle className="text-xl" /> 
                        <span className="font-extrabold uppercase tracking-wider text-sm">Add Service</span>
                    </Link>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="stat-grid">
                <div className="stat-card">
                    <div className="stat-icon-box success">
                        <HiOutlineCurrencyRupee />
                    </div>
                    <div>
                        <div className="stat-label">Total Earnings</div>
                        <div className="stat-value">₹{stats.totalEarnings?.toLocaleString() || '0'}</div>
                        <div className="stat-trend up"><HiOutlineTrendingUp /> +12%</div>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon-box primary">
                        <HiOutlineCollection />
                    </div>
                    <div>
                        <div className="stat-label">Active Listings</div>
                        <div className="stat-value">{stats.activeListings || '0'}</div>
                        <div className="stat-trend neutral">Managed items</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-box warning">
                        <HiOutlineClock />
                    </div>
                    <div>
                        <div className="stat-label">Pending</div>
                        <div className="stat-value">{stats.pendingBookings || '0'}</div>
                        <div className="stat-trend down text-amber-600">Action needed</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-box accent">
                        <HiOutlineCheck />
                    </div>
                    <div>
                        <div className="stat-label">Completed</div>
                        <div className="stat-value">{stats.completedBookings || '0'}</div>
                        <div className="stat-trend up">Great job!</div>
                    </div>
                </div>
            </div>

            <div className="dash-main-grid">
                {/* Recent Bookings Section */}
                <div className="dash-card">
                    <div className="dash-card-header">
                        <h2>Recent Booking Requests</h2>
                        <Link to="/bookings" className="btn-link text-sm">View All</Link>
                    </div>
                    
                    <div className="dash-list">
                        {recentBookings.length === 0 ? (
                            <div className="empty-state py-12">
                                <HiOutlineCalendar className="empty-state-icon" />
                                <h3>No recent bookings</h3>
                                <p>Requests from customers will appear here.</p>
                            </div>
                        ) : (
                            recentBookings.map(booking => (
                                <div key={booking._id} className="dash-row">
                                    <div className="avatar-mini bg-gray-100 w-10 h-10 flex-center rounded-xl font-black text-gray-500">
                                        {booking.userName[0]}
                                    </div>
                                    <div className="dash-row-info">
                                        <div className="dash-row-title">{booking.userName}</div>
                                        <div className="dash-row-sub">{booking.service?.title}</div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="dash-row-amount">₹{booking.amount}</div>
                                        <div className="flex gap-2">
                                            {booking.status === 'pending' ? (
                                                <>
                                                    <button onClick={() => handleBookingAction(booking._id, 'accepted')} className="btn-icon-sq bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white"><HiOutlineCheck /></button>
                                                    <button onClick={() => handleBookingAction(booking._id, 'rejected')} className="btn-icon-sq bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white"><HiOutlineX /></button>
                                                </>
                                            ) : (
                                                <span className={`status-badge-flat ${booking.status}`}>{booking.status}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="flex flex-col gap-6">
                    <div className="dash-card bg-white-bleed">
                        <h3 className="text-xl font-extrabold mb-6">Quick Shortcuts</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Link to="/agent/marketplace" className="shortcut-card">
                                <HiOutlineShoppingBag />
                                <span>Marketplace</span>
                            </Link>
                            <Link to="/earnings" className="shortcut-card">
                                <HiOutlineChartBar />
                                <span>Revenue</span>
                            </Link>
                            <Link to="/prices" className="shortcut-card">
                                <HiOutlineCurrencyRupee />
                                <span>Set Rates</span>
                            </Link>
                            <Link to="/notifications" className="shortcut-card">
                                <HiOutlineSpeakerphone />
                                <span>Alerts</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentDashboard;
