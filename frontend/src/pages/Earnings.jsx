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
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '28px' }}>
        <div style={{
            width: '56px', height: '56px', borderRadius: '16px', flexShrink: 0,
            backgroundColor: accent + '18', color: accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.7rem'
        }}>
            <Icon />
        </div>
        <div>
            <div style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-0.04em', lineHeight: 1, color: 'var(--text-main)' }}>{value}</div>
            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginTop: '4px' }}>{label}</div>
            {sub && <div style={{ fontSize: '0.78rem', color: accent, fontWeight: '700', marginTop: '2px' }}>{sub}</div>}
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
        if (!user?.agentId) { setLoading(false); return; }
        try {
            const [earningsRes, bookingsRes] = await Promise.all([
                api.get(`/agents/earnings/${user.agentId}`),
                api.get('/bookings')
            ]);
            setData(earningsRes.data.data);
            const all = bookingsRes.data.data || [];
            setBookings(all.filter(b => b.agent?._id === user.agentId || b.agent === user.agentId));
        } catch {
            setError('Could not load earnings data.');
        } finally {
            setLoading(false);
        }
    }, [user?.agentId]);

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

    if (!user?.agentId) return (
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
        <div className="page-wrapper">
            {/* Header */}
            <header className="section-header">
                <div className="section-eyebrow">Agent Finance</div>
                <h1 className="section-title">Earnings Overview</h1>
                <p className="section-sub">Track your revenue, respond to bookings, and review history.</p>
            </header>

            {error && (
                <div className="alert alert-error" style={{ marginBottom: '28px' }}>
                    <HiOutlineInformationCircle style={{ flexShrink: 0 }} />
                    {error}
                    <button onClick={() => setError(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
                        <HiOutlineX />
                    </button>
                </div>
            )}

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <StatCard icon={HiOutlineCurrencyRupee} label="Total Earnings" value={`₹${totalEarnings.toLocaleString('en-IN')}`} accent="#059669" />
                <StatCard icon={HiOutlineCheckCircle} label="Completed Jobs" value={completedCount} accent="#2563eb" />
                <StatCard icon={HiOutlineClock} label="Pending Jobs" value={pendingCount} accent="#f59e0b" />
                <StatCard icon={HiOutlineChartBar} label="Pending Payout" value={`₹${pendingAmount.toLocaleString('en-IN')}`} accent="#7c3aed" sub="Unlocks on completion" />
            </div>

            {/* ── Pending Bookings — action required ── */}
            {pendingBookings.length > 0 && (
                <div className="table-card" style={{ marginBottom: '32px' }}>
                    <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '22px', height: '22px', borderRadius: '50%',
                            backgroundColor: '#f59e0b', color: '#fff', fontSize: '0.75rem', fontWeight: '800'
                        }}>
                            {pendingBookings.length}
                        </span>
                        <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>Action Required — Pending Requests</h2>
                    </div>
                    <div className="table-scroll">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                                <tr>
                                    {['Customer', 'Service', 'Date', 'Fee', 'Action'].map(h => (
                                        <th key={h} style={{ padding: '12px 20px', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {pendingBookings.map(b => (
                                    <tr key={b._id} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: '#fffbeb' }}>
                                        <td style={{ padding: '14px 20px', fontWeight: '700' }}>{b.userName}<br /><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>{b.phone}</span></td>
                                        <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>{b.service?.title || '—'}</td>
                                        <td style={{ padding: '14px 20px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                            {formatDate(b.date)}
                                            {b.time && <><br /><span style={{ fontSize: '0.82rem' }}>🕐 {b.time}</span></>}
                                        </td>
                                        <td style={{ padding: '14px 20px', fontWeight: '700', color: '#059669' }}>₹{b.agentEarning ?? '—'}</td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    onClick={() => respond(b._id, 'accepted')}
                                                    disabled={!!responding[b._id]}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '5px',
                                                        padding: '7px 14px', borderRadius: '8px', border: 'none',
                                                        backgroundColor: responding[b._id] === 'accepting' ? '#6ee7b7' : '#059669',
                                                        color: '#fff', fontWeight: '700', fontSize: '0.82rem',
                                                        cursor: responding[b._id] ? 'not-allowed' : 'pointer',
                                                        opacity: responding[b._id] && responding[b._id] !== 'accepting' ? 0.5 : 1,
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {responding[b._id] === 'accepting'
                                                        ? <span className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }} />
                                                        : <HiOutlineThumbUp />}
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => respond(b._id, 'rejected')}
                                                    disabled={!!responding[b._id]}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '5px',
                                                        padding: '7px 14px', borderRadius: '8px', border: 'none',
                                                        backgroundColor: responding[b._id] === 'rejecting' ? '#fca5a5' : '#dc2626',
                                                        color: '#fff', fontWeight: '700', fontSize: '0.82rem',
                                                        cursor: responding[b._id] ? 'not-allowed' : 'pointer',
                                                        opacity: responding[b._id] && responding[b._id] !== 'rejecting' ? 0.5 : 1,
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {responding[b._id] === 'rejecting'
                                                        ? <span className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }} />
                                                        : <HiOutlineThumbDown />}
                                                    Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── Full Booking History ── */}
            <div className="table-card">
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
                    <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800' }}>Booking History</h2>
                </div>
                <div className="table-scroll">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                            <tr>
                                {['User', 'Service', 'Date', 'Amount', 'Status'].map(h => (
                                    <th key={h} style={{ padding: '13px 20px', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.length === 0 ? (
                                <tr><td colSpan="5" style={{ padding: '52px', textAlign: 'center', color: 'var(--text-muted)' }}>No bookings found.</td></tr>
                            ) : bookings.map(b => {
                                const cfg = STATUS_MAP[b.status] || STATUS_MAP.pending;
                                return (
                                    <tr key={b._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '16px 20px', fontWeight: '700' }}>{b.userName}</td>
                                        <td style={{ padding: '16px 20px', color: 'var(--text-muted)' }}>{b.service?.title || '—'}</td>
                                        <td style={{ padding: '16px 20px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{formatDate(b.date)}</td>
                                        <td style={{ padding: '16px 20px', fontWeight: '700', color: '#059669' }}>₹{b.agentEarning ?? '—'}</td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: '700', color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}>
                                                {cfg.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Earnings;
