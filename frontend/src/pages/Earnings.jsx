import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { getUser } from '../services/auth';
import {
    HiOutlineCurrencyRupee,
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineChartBar,
    HiOutlineInformationCircle,
    HiOutlineX,
    HiOutlineThumbUp,
    HiOutlineThumbDown
} from 'react-icons/hi';

const StatCard = ({ icon: Icon, label, value, accent, sub }) => (
    <div className="dash-card flex items-center gap-6 p-8">
        <div className="stat-icon-box" style={{ backgroundColor: accent + '18', color: accent }}>
            <Icon />
        </div>
        <div>
            <div className="stat-value">{value}</div>
            <div className="stat-label mt-1">{label}</div>
            {sub && <div className="text-[10px] font-bold mt-1" style={{ color: accent }}>{sub}</div>}
        </div>
    </div>
);

const STATUS_MAP = {
    completed: { label: 'Completed', color: '#065f46', bg: '#ecfdf5', border: '#6ee7b7' },
    accepted: { label: 'Accepted', color: '#1e40af', bg: '#eff6ff', border: '#bfdbfe' },
    rejected: { label: 'Rejected', color: '#991b1b', bg: '#fef2f2', border: '#fca5a5' },
    pending: { label: 'Pending', color: '#92400e', bg: '#fffbeb', border: '#fde68a' },
};

const Earnings = () => {
    const [data, setData] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [responding, setResponding] = useState({}); // bookingId → 'accepting'|'rejecting'

    const user = getUser();

    const fetchAll = useCallback(async () => {
        if (!user?._id) { setLoading(false); return; }
        try {
            const [earningsRes, bookingsRes] = await Promise.all([
                api.get('/agent/earnings'),
                api.get('/agent/bookings')
            ]);
            setData(earningsRes.data.data);
            setBookings(bookingsRes.data.data || []);
        } catch {
            setError('Could not load earnings data.');
        } finally {
            setLoading(false);
        }
    }, [user?._id]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const respond = async (bookingId, status) => {
        setResponding(prev => ({ ...prev, [bookingId]: status === 'accepted' ? 'accepting' : 'rejecting' }));
        try {
            await api.patch(`/bookings/respond/${bookingId}`, { status });
            // Optimistic UI — update booking status in place
            setBookings(prev =>
                prev.map(b => b._id === bookingId ? { ...b, status } : b)
            );
        } catch (err) {
            setError(err.response?.data?.error || 'Action failed, please try again.');
        } finally {
            setResponding(prev => { const n = { ...prev }; delete n[bookingId]; return n; });
        }
    };

    const formatDate = (d) =>
        d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

    if (loading) return (
        <div className="page-loading">
            <div className="spinner" />
            <span>Loading earnings...</span>
        </div>
    );

    if (!user?._id) return (
        <div className="page-wrapper">
            <div className="empty-state">
                <HiOutlineInformationCircle className="empty-state-icon" />
                <h3>Agent account required</h3>
                <p>Earnings are only available for Agent accounts.</p>
            </div>
        </div>
    );

    const totalEarnings = data?.earnings ?? 0;
    const completedCount = bookings.filter(b => b.status === 'completed').length;
    const pendingCount = bookings.filter(b => b.status === 'pending').length;
    const pendingAmount = bookings.filter(b => b.status !== 'completed')
        .reduce((s, b) => s + (b.agentEarning || 0), 0);

    const pendingBookings = bookings.filter(b => b.status === 'pending');

    return (
        <div className="earnings-container app-container py-8">
            {/* Header */}
            <header className="dash-header">
                <div className="dash-title-group">
                    <div className="dash-eyebrow">Agent Finance</div>
                    <h1 className="dash-title">Earnings Overview</h1>
                    <p className="dash-subtitle">Track your revenue, respond to bookings, and review history.</p>
                </div>
            </header>

            {error && (
                <div className="alert alert-error mb-8 p-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 flex items-center gap-3">
                    <HiOutlineInformationCircle className="shrink-0 text-xl" />
                    <span className="font-bold flex-1">{error}</span>
                    <button onClick={() => setError(null)} className="p-1 hover:bg-rose-100 rounded-lg transition-all">
                        <HiOutlineX />
                    </button>
                </div>
            )}

            {/* Stat Cards */}
            <div className="stat-grid">
                <div className="stat-card">
                    <div className="stat-icon-box success">
                        <HiOutlineCurrencyRupee />
                    </div>
                    <div>
                        <div className="stat-label">Total Earnings</div>
                        <div className="stat-value">₹{totalEarnings.toLocaleString('en-IN')}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-box primary">
                        <HiOutlineCheckCircle />
                    </div>
                    <div>
                        <div className="stat-label">Completed Jobs</div>
                        <div className="stat-value">{completedCount}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-box warning">
                        <HiOutlineClock />
                    </div>
                    <div>
                        <div className="stat-label">Pending Jobs</div>
                        <div className="stat-value">{pendingCount}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-box accent">
                        <HiOutlineChartBar />
                    </div>
                    <div>
                        <div className="stat-label">Pending Payout</div>
                        <div className="stat-value">₹{pendingAmount.toLocaleString('en-IN')}</div>
                        <div className="stat-trend neutral">Unlocks on completion</div>
                    </div>
                </div>
            </div>

            <div className="dash-main-grid">
                {/* ── Pending Bookings — action required ── */}
                <div className="flex flex-col gap-8">
                    {pendingBookings.length > 0 && (
                        <div className="dash-card">
                            <div className="dash-card-header">
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-amber-500 text-white flex-center font-black text-xs">
                                        {pendingBookings.length}
                                    </span>
                                    <h2>Pending Requests</h2>
                                </div>
                            </div>
                            
                            <div className="dash-list">
                                {pendingBookings.map(b => (
                                    <div key={b._id} className="dash-row bg-amber-50/50 border-amber-100">
                                        <div className="dash-row-info">
                                            <div className="dash-row-title">{b.userName}</div>
                                            <div className="dash-row-sub">{b.service?.title || '—'} • {formatDate(b.date)}</div>
                                        </div>
                                        <div className="flex flex-col items-end gap-3">
                                            <div className="dash-row-amount text-emerald-600">₹{b.agentEarning ?? '—'}</div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => respond(b._id, 'accepted')}
                                                    disabled={!!responding[b._id]}
                                                    className={`btn-icon-sq bg-emerald-500 text-white hover:bg-emerald-600 ${responding[b._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {responding[b._id] === 'accepting'
                                                        ? <div className="spinner-mini" />
                                                        : <HiOutlineThumbUp />}
                                                </button>
                                                <button
                                                    onClick={() => respond(b._id, 'rejected')}
                                                    disabled={!!responding[b._id]}
                                                    className={`btn-icon-sq bg-rose-500 text-white hover:bg-rose-600 ${responding[b._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {responding[b._id] === 'rejecting'
                                                        ? <div className="spinner-mini" />
                                                        : <HiOutlineThumbDown />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Full Booking History ── */}
                    <div className="dash-card">
                        <div className="dash-card-header">
                            <h2>Booking History</h2>
                        </div>
                        
                        <div className="dash-list">
                            {bookings.length === 0 ? (
                                <div className="empty-state py-8">
                                    <p>No bookings found.</p>
                                </div>
                            ) : bookings.map(b => {
                                const cfg = STATUS_MAP[b.status] || STATUS_MAP.pending;
                                return (
                                    <div key={b._id} className="dash-row">
                                        <div className="dash-row-info">
                                            <div className="dash-row-title">{b.userName}</div>
                                            <div className="dash-row-sub">{b.service?.title || '—'} • {formatDate(b.date)}</div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="dash-row-amount">₹{b.agentEarning ?? '—'}</div>
                                            <span className={`status-badge-flat ${b.status}`}>{cfg.label}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="dash-card bg-indigo-900 text-white">
                        <HiOutlineTrendingUp className="text-4xl text-indigo-300 mb-6" />
                        <h3 className="text-xl font-black mb-2">Finance Tips</h3>
                        <p className="text-indigo-200 text-sm leading-relaxed">
                            Maintain a high completion rate to unlock faster payouts and better visibility in the community marketplace.
                        </p>
                    </div>

                    <div className="promo-card border-none bg-emerald-50 p-6 rounded-3xl">
                        <div className="flex items-center gap-4 text-emerald-800">
                            <HiOutlineInformationCircle className="text-2xl" />
                            <div className="font-bold text-sm">Synchronized Payouts</div>
                        </div>
                        <p className="text-xs text-emerald-700/70 mt-3 leading-relaxed">
                            Our system ensures all payments are safely held until service completion, protecting both agents and customers.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Earnings;
