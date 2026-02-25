import { useState, useEffect } from 'react';
import api from '../services/api';
import { getUser } from '../services/auth';
import {
    HiOutlineCurrencyRupee,
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineChartBar,
    HiOutlineInformationCircle
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

const Earnings = () => {
    const [data, setData] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = getUser();

    useEffect(() => {
        const fetchEarnings = async () => {
            if (!user?.agentId) { setLoading(false); return; }
            try {
                const [earningsRes, bookingsRes] = await Promise.all([
                    api.get(`/agents/earnings/${user.agentId}`),
                    api.get('/bookings')
                ]);
                setData(earningsRes.data.data);
                // Filter bookings for this agent
                const all = bookingsRes.data.data || [];
                setBookings(all.filter(b => b.agent?._id === user.agentId || b.agent === user.agentId));
            } catch (err) {
                setError('Could not load earnings data.');
            } finally {
                setLoading(false);
            }
        };
        fetchEarnings();
    }, []);

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

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
    const pendingAmount = bookings.filter(b => b.status !== 'completed').reduce((sum, b) => sum + (b.agentEarning || 0), 0);

    return (
        <div className="page-wrapper">
            {/* Header */}
            <header className="section-header">
                <div className="section-eyebrow">Agent Finance</div>
                <h1 className="section-title">Earnings Overview</h1>
                <p className="section-sub">Track your revenue and completed appointments.</p>
            </header>

            {error && <div className="alert alert-error" style={{ marginBottom: '28px' }}><HiOutlineInformationCircle />{error}</div>}

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <StatCard icon={HiOutlineCurrencyRupee} label="Total Earnings" value={`₹${totalEarnings.toLocaleString('en-IN')}`} accent="#059669" />
                <StatCard icon={HiOutlineCheckCircle} label="Completed Jobs" value={completedCount} accent="#2563eb" />
                <StatCard icon={HiOutlineClock} label="Pending Jobs" value={pendingCount} accent="#f59e0b" />
                <StatCard icon={HiOutlineChartBar} label="Pending Payout" value={`₹${pendingAmount.toLocaleString('en-IN')}`} accent="#7c3aed" sub="Unlocks on completion" />
            </div>

            {/* Bookings Table */}
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
                                const statusMap = {
                                    completed: { label: 'Completed', color: '#065f46', bg: '#ecfdf5', border: '#6ee7b7' },
                                    accepted: { label: 'Accepted', color: '#1e40af', bg: '#eff6ff', border: '#bfdbfe' },
                                    pending: { label: 'Pending', color: '#92400e', bg: '#fffbeb', border: '#fde68a' }
                                };
                                const cfg = statusMap[b.status] || statusMap.pending;
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
