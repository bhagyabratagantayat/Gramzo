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
        <div className="page-wrapper dashboard-admin">
            <header className="dash-header">
                <div>
                    <div className="section-eyebrow">System Administrator</div>
                    <h1 className="section-title">Control Center</h1>
                    <p className="section-sub">Real-time system health and management tools.</p>
                </div>
                <div className="header-badge">
                    <HiOutlineShieldCheck /> Secure Node
                </div>
            </header>

            {/* Platform Stats */}
            <div className="stats-grid">
                <div className="stat-card modern blue">
                    <div className="stat-info">
                        <span className="label">Total Users</span>
                        <h3 className="value">{stats.totalUsers}</h3>
                    </div>
                    <HiOutlineUserGroup className="bg-icon" />
                </div>
                <div className="stat-card modern purple">
                    <div className="stat-info">
                        <span className="label">Total Agents</span>
                        <h3 className="value">{stats.totalAgents}</h3>
                    </div>
                    <HiOutlineCube className="bg-icon" />
                </div>
                <div className="stat-card modern orange">
                    <div className="stat-info">
                        <span className="label">Active Listings</span>
                        <h3 className="value">{stats.totalListings}</h3>
                    </div>
                    <HiOutlineShoppingBag className="bg-icon" />
                </div>
                <div className="stat-card modern green">
                    <div className="stat-info">
                        <span className="label">Daily Orders</span>
                        <h3 className="value">{stats.totalOrders}</h3>
                    </div>
                    <HiOutlineTrendingUp className="bg-icon" />
                </div>
            </div>

            <div className="admin-grid">
                {/* Management Shortcuts */}
                <div className="management-panels">
                    <h2 className="group-title">Management Panels</h2>
                    <div className="panel-grid">
                        <Link to="/admin" className="panel-card">
                            <div className="panel-icon"><HiOutlineUserGroup /></div>
                            <div className="panel-text">
                                <h4>Verify Agents</h4>
                                <p>Approve or block registered sellers.</p>
                            </div>
                        </Link>
                        <Link to="/all-bookings" className="panel-card">
                            <div className="panel-icon"><HiOutlineCollection /></div>
                            <div className="panel-text">
                                <h4>Global Bookings</h4>
                                <p>Monitor all transactions & services.</p>
                            </div>
                        </Link>
                        <Link to="/notifications" className="panel-card">
                            <div className="panel-icon"><HiOutlineSpeakerphone /></div>
                            <div className="panel-text">
                                <h4>Community Notice</h4>
                                <p>Broadcast updates to everyone.</p>
                            </div>
                        </Link>
                        <Link to="/marketplace" className="panel-card">
                            <div className="panel-icon"><HiOutlineShoppingBag /></div>
                            <div className="panel-text">
                                <h4>Manage Products</h4>
                                <p>Cleanup inappropriate listings.</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* System Activity Feed (Mock/Basic) */}
                <div className="activity-panel">
                    <h2 className="group-title">System Activity</h2>
                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="dot green"></div>
                            <div className="text">System core is healthy</div>
                            <span className="time">Just now</span>
                        </div>
                        <div className="activity-item">
                            <div className="dot blue"></div>
                            <div className="text">Database synchronized</div>
                            <span className="time">2m ago</span>
                        </div>
                        <div className="activity-item">
                            <div className="dot orange"></div>
                            <div className="text">Backup completed</div>
                            <span className="time">15m ago</span>
                        </div>
                        <div className="activity-item">
                            <div className="dot purp"></div>
                            <div className="text">JWT auth verification active</div>
                            <span className="time">Always</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .dashboard-admin { padding-top: 20px; }
                .header-badge {
                    display: flex; alignItems: center; gap: 8px;
                    background: #fdf2f8; color: #db2777; padding: 8px 16px;
                    border-radius: 999px; font-weight: 800; font-size: 0.85rem;
                }
                .stats-grid { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); 
                    gap: 20px; 
                    margin-bottom: 40px; 
                }
                .stat-card.modern {
                    position: relative; overflow: hidden;
                    background: #fff; border-radius: 24px; padding: 28px;
                    border: 1px solid var(--border-color);
                    transition: transform 0.2s;
                }
                .stat-card.modern:hover { transform: translateY(-5px); }
                .stat-card.modern.blue { border-bottom: 4px solid #3b82f6; }
                .stat-card.modern.purple { border-bottom: 4px solid #8b5cf6; }
                .stat-card.modern.orange { border-bottom: 4px solid #f59e0b; }
                .stat-card.modern.green { border-bottom: 4px solid #10b981; }

                .stat-info { position: relative; z-index: 2; }
                .stat-info .label { font-size: 0.85rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
                .stat-info .value { font-size: 2.5rem; font-weight: 900; margin-top: 8px; letter-spacing: -0.05em; }
                
                .bg-icon {
                    position: absolute; right: -10px; bottom: -10px;
                    font-size: 5rem; opacity: 0.05; z-index: 1;
                }

                .admin-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 40px; }
                @media (max-width: 1000px) { .admin-grid { grid-template-columns: 1fr; } }

                .group-title { font-size: 1.3rem; font-weight: 800; margin-bottom: 24px; }
                
                .panel-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                @media (max-width: 600px) { .panel-grid { grid-template-columns: 1fr; } }

                .panel-card {
                    background: #fff; border: 1px solid var(--border-color); border-radius: 20px;
                    padding: 24px; display: flex; gap: 16px; align-items: center;
                    transition: all 0.2s;
                }
                .panel-card:hover { border-color: var(--primary-color); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
                .panel-icon {
                    width: 48px; height: 48px; border-radius: 12px; background: #f8fafc;
                    display: flex; alignItems: center; justifyContent: center;
                    font-size: 1.4rem; color: var(--primary-color);
                }
                .panel-text h4 { margin: 0; font-size: 1rem; font-weight: 700; }
                .panel-text p { margin: 4px 0 0 0; font-size: 0.85rem; color: var(--text-muted); }

                .activity-panel { background: #fff; border-radius: 24px; border: 1px solid var(--border-color); padding: 24px; }
                .activity-list { display: flex; flex-direction: column; gap: 20px; }
                .activity-item { display: flex; align-items: center; gap: 12px; }
                .dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
                .dot.green { background: #10b981; box-shadow: 0 0 10px #10b981; }
                .dot.blue { background: #3b82f6; }
                .dot.orange { background: #f59e0b; }
                .dot.purp { background: #8b5cf6; }
                .activity-item .text { flex: 1; font-size: 0.9rem; font-weight: 600; }
                .activity-item .time { font-size: 0.75rem; color: var(--text-muted); }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
