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
        <div className="user-dashboard-container app-container py-8">
            <header className="dash-header">
                <div className="dash-title-group">
                    <div className="dash-eyebrow">User Space</div>
                    <div className="flex items-center gap-4">
                        <div className="hero-avatar-mini bg-primary-light text-primary p-3 rounded-2xl text-2xl border border-primary/10">
                            <HiOutlineUser />
                        </div>
                        <div>
                            <h1 className="dash-title">Happy Day, {user?.name.split(' ')[0]}!</h1>
                            <p className="dash-subtitle">Here's a look at your community activity.</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="dash-main-grid">
                {/* Bookings Section */}
                <div className="dash-card">
                    <div className="dash-card-header">
                        <h2>Your Booked Services</h2>
                        <div className="flex items-center gap-2">
                            <Link to="/bookings" className="btn-link text-sm">
                                View History <HiOutlineArrowRight />
                            </Link>
                        </div>
                    </div>
                    
                    <div className="dash-list">
                        {recentBookings.length === 0 ? (
                            <div className="empty-state py-12">
                                <HiOutlineCalendar className="empty-state-icon" />
                                <h3>No active bookings yet</h3>
                                <p>Explore our wide range of community-verified services.</p>
                                <Link to="/services" className="btn-primary mt-6">Explore Services</Link>
                            </div>
                        ) : (
                            recentBookings.map(b => (
                                <div key={b._id} className="dash-row">
                                    <div className={`status-line bg-${b.status === 'pending' ? 'amber' : b.status === 'accepted' ? 'emerald' : 'indigo'}-500 w-1 h-10 rounded-full`} />
                                    <div className="dash-row-info">
                                        <div className="dash-row-title">{b.service?.title}</div>
                                        <div className="dash-row-sub flex items-center gap-2">
                                            {new Date(b.date).toLocaleDateString()}
                                            <span className={`status-badge-flat ${b.status}`}>{b.status}</span>
                                        </div>
                                    </div>
                                    <div className="dash-row-amount">₹{b.amount}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Community Hub / Quick Links */}
                <div className="flex flex-col gap-6">
                    <div className="dash-card bg-white-bleed">
                        <h2 className="text-xl font-extrabold mb-6">Community Hub</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <Link to="/marketplace" className="hub-card-fancy bg-indigo-600 text-white">
                                <HiOutlineShoppingBag className="text-2xl mb-2" />
                                <span>Marketplace</span>
                            </Link>
                            <Link to="/prices" className="hub-card-fancy bg-emerald-600 text-white">
                                <HiOutlineInformationCircle className="text-2xl mb-2" />
                                <span>Market Prices</span>
                            </Link>
                            <Link to="/notifications" className="hub-card-fancy bg-amber-600 text-white col-span-2">
                                <HiOutlineBell className="text-2xl mb-2" />
                                <span>Help & Alerts</span>
                            </Link>
                        </div>
                    </div>

                    <div className="promo-card card-premium p-8 bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm"><HiOutlineUser /></div>
                            <div>
                                <h4 className="font-extrabold text-indigo-900">Support Local Agents</h4>
                                <p className="text-sm text-indigo-700/70 mt-1">Book verified experts from your own community and help local businesses grow.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
