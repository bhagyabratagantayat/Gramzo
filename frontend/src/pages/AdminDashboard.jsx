import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
    HiOutlineShieldCheck,
    HiOutlineUserGroup,
    HiOutlineCollection,
    HiOutlineShoppingBag,
    HiOutlineTrendingUp,
    HiOutlineSpeakerphone,
    HiOutlineCube,
    HiOutlineClock
} from 'react-icons/hi';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAgents: 0,
        totalListings: 0,
        totalOrders: 0,
        activeNotices: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/overview');
                setStats(res.data.data || stats);
            } catch (err) {
                console.error('Failed to fetch admin stats');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="flex-center" style={{ height: '60vh' }}><div className="spinner"></div></div>;

    return (
        <div className="admin-dashboard-container app-container py-8">
            <header className="dash-header">
                <div className="dash-title-group">
                    <div className="dash-eyebrow">System Administrator</div>
                    <h1 className="dash-title">Control Center</h1>
                    <p className="dash-subtitle">Real-time system health and management tools.</p>
                </div>
                <div className="header-badge bg-rose-50 text-rose-600 px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-2 border border-rose-100">
                    <HiOutlineShieldCheck className="text-lg" /> Secure Node
                </div>
            </header>

            {/* Platform Stats */}
            <div className="stat-grid">
                <div className="stat-card">
                    <div className="stat-icon-box primary">
                        <HiOutlineUserGroup />
                    </div>
                    <div>
                        <div className="stat-label">Total Users</div>
                        <div className="stat-value">{stats.totalUsers}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-box accent">
                        <HiOutlineCube />
                    </div>
                    <div>
                        <div className="stat-label">Total Agents</div>
                        <div className="stat-value">{stats.totalAgents}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-box warning">
                        <HiOutlineShoppingBag />
                    </div>
                    <div>
                        <div className="stat-label">Active Listings</div>
                        <div className="stat-value">{stats.totalListings}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-box success">
                        <HiOutlineTrendingUp />
                    </div>
                    <div>
                        <div className="stat-label">Daily Orders</div>
                        <div className="stat-value">{stats.totalOrders}</div>
                    </div>
                </div>
            </div>

            <div className="dash-main-grid">
                {/* Management Shortcuts */}
                <div className="dash-card">
                    <div className="dash-card-header">
                        <h2>Management Panels</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link to="/admin" className="dash-row hover:bg-white border hover:border-primary transition-all">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl text-xl"><HiOutlineUserGroup /></div>
                            <div className="dash-row-info">
                                <div className="dash-row-title">Verify Agents</div>
                                <div className="dash-row-sub">Approve or block registered sellers.</div>
                            </div>
                        </Link>
                        <Link to="/all-bookings" className="dash-row hover:bg-white border hover:border-primary transition-all">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl text-xl"><HiOutlineCollection /></div>
                            <div className="dash-row-info">
                                <div className="dash-row-title">Global Bookings</div>
                                <div className="dash-row-sub">Monitor all transactions & services.</div>
                            </div>
                        </Link>
                        <Link to="/notifications" className="dash-row hover:bg-white border hover:border-primary transition-all">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl text-xl"><HiOutlineSpeakerphone /></div>
                            <div className="dash-row-info">
                                <div className="dash-row-title">Community Notice</div>
                                <div className="dash-row-sub">Broadcast updates to everyone.</div>
                            </div>
                        </Link>
                        <Link to="/marketplace" className="dash-row hover:bg-white border hover:border-primary transition-all">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl text-xl"><HiOutlineShoppingBag /></div>
                            <div className="dash-row-info">
                                <div className="dash-row-title">Manage Products</div>
                                <div className="dash-row-sub">Cleanup inappropriate listings.</div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* System Activity Feed */}
                <div className="dash-card bg-white-bleed">
                    <h2 className="text-xl font-extrabold mb-6">System Health</h2>
                    <div className="dash-list">
                        <div className="activity-item-premium flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 mb-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                            <div className="flex-1 text-sm font-bold text-slate-700">System core is healthy</div>
                            <div className="text-[10px] uppercase font-black text-gray-400">Just now</div>
                        </div>
                        <div className="activity-item-premium flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 mb-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <div className="flex-1 text-sm font-bold text-slate-700">Database synchronized</div>
                            <div className="text-[10px] uppercase font-black text-gray-400">2m ago</div>
                        </div>
                        <div className="activity-item-premium flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 mb-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            <div className="flex-1 text-sm font-bold text-slate-700">Backup completed</div>
                            <div className="text-[10px] uppercase font-black text-gray-400">15m ago</div>
                        </div>
                        <div className="activity-item-premium flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100">
                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            <div className="flex-1 text-sm font-bold text-slate-700">JWT auth verification active</div>
                            <div className="text-[10px] uppercase font-black text-gray-400">Always</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
