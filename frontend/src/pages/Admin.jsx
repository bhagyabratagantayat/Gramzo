import { useState, useEffect } from 'react';
import api from '../services/api';
import {
    HiOutlineShieldCheck,
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineUserGroup,
    HiOutlineCalendar,
    HiOutlineSpeakerphone,
    HiOutlineChartBar,
    HiOutlineCollection,
    HiOutlineBan,
    HiOutlinePlus,
    HiOutlineLocationMarker,
    HiOutlineBell,
    HiOutlinePhone
} from 'react-icons/hi';

/* ─── Shared Styles ─────────────────────────────────────────── */
const thStyle = {
    padding: '13px 20px',
    fontSize: '0.78rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    textAlign: 'left',
    whiteSpace: 'nowrap'
};

const tdStyle = {
    padding: '16px 20px',
    fontSize: '0.95rem',
    verticalAlign: 'middle'
};

const sectionTitle = {
    fontSize: '1.35rem',
    fontWeight: '800',
    margin: '0 0 4px 0',
    letterSpacing: '-0.02em'
};

const sectionSub = {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    margin: 0
};

/* ─── Status Badges ────────────────────────────────────────── */
const agentBadge = (agent) => {
    if (agent.isBlocked) return { label: 'Blocked', color: '#b91c1c', bg: '#fef2f2', border: '#fecaca' };
    if (agent.isApproved) return { label: 'Approved', color: '#065f46', bg: '#ecfdf5', border: '#6ee7b7' };
    return { label: 'Pending', color: '#92400e', bg: '#fffbeb', border: '#fde68a' };
};

const bookingBadge = (status) => {
    const map = {
        pending: { label: 'Pending', color: '#92400e', bg: '#fffbeb', border: '#fde68a' },
        accepted: { label: 'Accepted', color: '#1e40af', bg: '#eff6ff', border: '#bfdbfe' },
        completed: { label: 'Completed', color: '#065f46', bg: '#ecfdf5', border: '#6ee7b7' }
    };
    return map[status] || map.pending;
};

const Badge = ({ cfg }) => (
    <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        padding: '5px 12px', borderRadius: '999px',
        fontSize: '0.78rem', fontWeight: '700',
        color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}`
    }}>
        {cfg.label}
    </span>
);

/* ─── Stat Card ────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, accent }) => (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px 28px' }}>
        <div style={{
            width: '52px', height: '52px', borderRadius: '14px',
            backgroundColor: accent + '18', color: accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem', flexShrink: 0
        }}>
            <Icon />
        </div>
        <div>
            <div style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-0.04em', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '4px' }}>{label}</div>
        </div>
    </div>
);

/* ─── Tab Button ─────────────────────────────────────────────*/
const Tab = ({ id, label, icon: Icon, active, onClick }) => (
    <button
        onClick={() => onClick(id)}
        style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '10px 18px', borderRadius: '8px', border: 'none',
            fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer',
            backgroundColor: active ? 'var(--primary-color)' : 'transparent',
            color: active ? '#fff' : 'var(--text-muted)',
            transition: 'var(--transition)'
        }}
    >
        <Icon style={{ fontSize: '1.1rem' }} />
        {label}
    </button>
);

/* ─── Empty Row ──────────────────────────────────────────────*/
const EmptyRow = ({ cols, message }) => (
    <tr>
        <td colSpan={cols} style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-muted)', padding: '52px 20px' }}>
            {message}
        </td>
    </tr>
);

/* ═══════════════════════════════════════════════════════════ */
const Admin = () => {
    const [tab, setTab] = useState('overview');
    const [agents, setAgents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    // Notice form state
    const [noticeTitle, setNoticeTitle] = useState('');
    const [noticeDesc, setNoticeDesc] = useState('');
    const [noticeLoc, setNoticeLoc] = useState('');
    const [noticePosting, setNoticePosting] = useState(false);
    const [noticeMsg, setNoticeMsg] = useState(null);

    const fetchAll = async () => {
        try {
            const [agentsRes, bookingsRes, noticesRes] = await Promise.all([
                api.get('/agents'),
                api.get('/bookings'),
                api.get('/notifications')
            ]);
            setAgents(agentsRes.data.data || []);
            setBookings(bookingsRes.data.data || []);
            setNotices(noticesRes.data.data || []);
        } catch (err) {
            console.error('Admin fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    const handleApprove = async (id) => {
        try {
            await api.patch(`/agents/approve/${id}`);
            fetchAll();
        } catch { alert('Failed to approve agent.'); }
    };

    const handleBlock = async (id) => {
        try {
            await api.patch(`/agents/block/${id}`);
            fetchAll();
        } catch { alert('Failed to block agent.'); }
    };

    const handleNotice = async (e) => {
        e.preventDefault();
        setNoticePosting(true);
        setNoticeMsg(null);
        try {
            await api.post('/notifications/add', { title: noticeTitle, description: noticeDesc, location: noticeLoc, role: 'Admin' });
            setNoticeTitle(''); setNoticeDesc(''); setNoticeLoc('');
            setNoticeMsg({ type: 'success', text: 'Notice posted successfully.' });
            fetchAll();
        } catch {
            setNoticeMsg({ type: 'error', text: 'Failed to post notice.' });
        } finally {
            setNoticePosting(false);
        }
    };

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

    const inputStyle = {
        width: '100%', padding: '10px 14px', borderRadius: '8px', boxSizing: 'border-box',
        border: '1px solid var(--border-color)', fontSize: '0.95rem', fontFamily: 'inherit',
        outline: 'none', transition: 'var(--transition)', backgroundColor: '#fff'
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-muted)' }}>
            Loading admin dashboard...
        </div>
    );

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>

            {/* ── Page Header ── */}
            <header style={{ marginBottom: '36px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <div style={{ color: 'var(--danger-color)', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                        Management Console
                    </div>
                    <h1 style={{ margin: 0, fontSize: '2.25rem', fontWeight: '900', letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <HiOutlineShieldCheck style={{ color: 'var(--danger-color)' }} /> Admin Dashboard
                    </h1>
                </div>
            </header>

            {/* ── Tabs ── */}
            <div style={{
                display: 'flex', gap: '6px', padding: '6px',
                backgroundColor: '#fff', borderRadius: '10px',
                border: '1px solid var(--border-color)',
                marginBottom: '32px', flexWrap: 'wrap'
            }}>
                <Tab id="overview" label="Overview" icon={HiOutlineChartBar} active={tab === 'overview'} onClick={setTab} />
                <Tab id="agents" label={`Agents (${agents.length})`} icon={HiOutlineUserGroup} active={tab === 'agents'} onClick={setTab} />
                <Tab id="bookings" label={`Bookings (${bookings.length})`} icon={HiOutlineCollection} active={tab === 'bookings'} onClick={setTab} />
                <Tab id="notices" label="Notice Board" icon={HiOutlineSpeakerphone} active={tab === 'notices'} onClick={setTab} />
            </div>

            {/* ══ OVERVIEW TAB ══ */}
            {tab === 'overview' && (
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                        <StatCard icon={HiOutlineUserGroup} label="Total Agents" value={agents.length} accent="#2563eb" />
                        <StatCard icon={HiOutlineCollection} label="Total Bookings" value={bookings.length} accent="#7c3aed" />
                        <StatCard icon={HiOutlineCheckCircle} label="Approved Agents" value={agents.filter(a => a.isApproved && !a.isBlocked).length} accent="#059669" />
                        <StatCard icon={HiOutlineClock} label="Pending Approvals" value={agents.filter(a => !a.isApproved && !a.isBlocked).length} accent="#f59e0b" />
                    </div>

                    {/* Overview — recent bookings snippet */}
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
                            <h2 style={sectionTitle}>Recent Bookings</h2>
                            <p style={sectionSub}>Last 5 platform bookings</p>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                                    <tr>
                                        <th style={thStyle}>User</th>
                                        <th style={thStyle}>Service</th>
                                        <th style={thStyle}>Date</th>
                                        <th style={thStyle}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.slice(0, 5).map(b => (
                                        <tr key={b._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ ...tdStyle, fontWeight: '600' }}>{b.userName}</td>
                                            <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>{b.service?.title || '—'}</td>
                                            <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>{formatDate(b.date)}</td>
                                            <td style={tdStyle}><Badge cfg={bookingBadge(b.status)} /></td>
                                        </tr>
                                    ))}
                                    {bookings.length === 0 && <EmptyRow cols={4} message="No bookings yet." />}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ══ AGENTS TAB ══ */}
            {tab === 'agents' && (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
                        <h2 style={sectionTitle}>Agent Management</h2>
                        <p style={sectionSub}>Approve or block agent accounts on the platform.</p>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                                <tr>
                                    <th style={thStyle}>Agent Name</th>
                                    <th style={thStyle}>Location</th>
                                    <th style={thStyle}>Phone</th>
                                    <th style={thStyle}>Status</th>
                                    <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {agents.map(agent => (
                                    <tr key={agent._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ ...tdStyle, fontWeight: '700' }}>{agent.name}</td>
                                        <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>{agent.location || '—'}</td>
                                        <td style={{ ...tdStyle, color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <HiOutlinePhone /> {agent.phone || '—'}
                                            </span>
                                        </td>
                                        <td style={tdStyle}><Badge cfg={agentBadge(agent)} /></td>
                                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                {!agent.isApproved && !agent.isBlocked && (
                                                    <button
                                                        onClick={() => handleApprove(agent._id)}
                                                        className="btn-primary"
                                                        style={{ padding: '7px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                                                    >
                                                        <HiOutlineCheckCircle /> Approve
                                                    </button>
                                                )}
                                                {agent.isApproved && !agent.isBlocked && (
                                                    <button
                                                        onClick={() => handleBlock(agent._id)}
                                                        style={{
                                                            padding: '7px 14px', fontSize: '0.82rem', border: '1px solid #fecaca',
                                                            backgroundColor: '#fef2f2', color: '#b91c1c', borderRadius: '8px',
                                                            fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px',
                                                            cursor: 'pointer', transition: 'var(--transition)'
                                                        }}
                                                    >
                                                        <HiOutlineBan /> Block
                                                    </button>
                                                )}
                                                {agent.isBlocked && (
                                                    <button
                                                        onClick={() => handleBlock(agent._id)}
                                                        style={{
                                                            padding: '7px 14px', fontSize: '0.82rem', border: '1px solid #bfdbfe',
                                                            backgroundColor: '#eff6ff', color: '#1d4ed8', borderRadius: '8px',
                                                            fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px',
                                                            cursor: 'pointer', transition: 'var(--transition)'
                                                        }}
                                                    >
                                                        <HiOutlineCheckCircle /> Unblock
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {agents.length === 0 && <EmptyRow cols={5} message="No agents registered yet." />}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ══ BOOKINGS TAB ══ */}
            {tab === 'bookings' && (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
                        <h2 style={sectionTitle}>All Bookings</h2>
                        <p style={sectionSub}>Full overview of every service request on the platform.</p>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                                <tr>
                                    <th style={thStyle}>User</th>
                                    <th style={thStyle}>Phone</th>
                                    <th style={thStyle}>Service</th>
                                    <th style={thStyle}>Agent</th>
                                    <th style={thStyle}>Date</th>
                                    <th style={thStyle}>Amount</th>
                                    <th style={thStyle}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(b => (
                                    <tr key={b._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ ...tdStyle, fontWeight: '700' }}>{b.userName}</td>
                                        <td style={{ ...tdStyle, color: 'var(--text-muted)', fontSize: '0.88rem' }}>{b.phone || '—'}</td>
                                        <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>{b.service?.title || '—'}</td>
                                        <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>{b.agent?.name || '—'}</td>
                                        <td style={{ ...tdStyle, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{formatDate(b.date)}</td>
                                        <td style={{ ...tdStyle, fontWeight: '700', color: 'var(--primary-color)' }}>
                                            {b.amount ? `₹${b.amount}` : '—'}
                                        </td>
                                        <td style={tdStyle}><Badge cfg={bookingBadge(b.status)} /></td>
                                    </tr>
                                ))}
                                {bookings.length === 0 && <EmptyRow cols={7} message="No bookings found." />}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ══ NOTICE BOARD TAB ══ */}
            {tab === 'notices' && (
                <div style={{ display: 'grid', gap: '28px', gridTemplateColumns: '1fr 1.5fr' }}>

                    {/* Left — Post form */}
                    <div className="card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                            <HiOutlinePlus style={{ fontSize: '1.2rem', color: 'var(--primary-color)' }} />
                            <h2 style={{ ...sectionTitle, margin: 0 }}>Post a Notice</h2>
                        </div>

                        {noticeMsg && (
                            <div style={{
                                padding: '10px 14px', borderRadius: '8px', marginBottom: '16px',
                                fontSize: '0.88rem', fontWeight: '600',
                                backgroundColor: noticeMsg.type === 'success' ? '#ecfdf5' : '#fef2f2',
                                color: noticeMsg.type === 'success' ? '#065f46' : '#b91c1c',
                                border: `1px solid ${noticeMsg.type === 'success' ? '#6ee7b7' : '#fecaca'}`
                            }}>
                                {noticeMsg.text}
                            </div>
                        )}

                        <form onSubmit={handleNotice} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={noticeTitle}
                                    onChange={e => setNoticeTitle(e.target.value)}
                                    placeholder="e.g. Water supply disruption"
                                    required
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={noticeLoc}
                                    onChange={e => setNoticeLoc(e.target.value)}
                                    placeholder="e.g. Ward 4, Rampur"
                                    required
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Description
                                </label>
                                <textarea
                                    value={noticeDesc}
                                    onChange={e => setNoticeDesc(e.target.value)}
                                    placeholder="Details of the community notice..."
                                    required
                                    rows={4}
                                    style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={noticePosting}
                                className="btn-primary"
                                style={{ padding: '11px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}
                            >
                                <HiOutlineSpeakerphone />
                                {noticePosting ? 'Posting...' : 'Post Notice'}
                            </button>
                        </form>
                    </div>

                    {/* Right — Existing notices */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <HiOutlineBell style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }} />
                            <h2 style={{ ...sectionTitle, margin: 0 }}>Posted Notices</h2>
                        </div>

                        {notices.length === 0 && (
                            <div className="card" style={{ textAlign: 'center', padding: '48px 24px', border: '1px dashed var(--border-color)' }}>
                                <HiOutlineBell style={{ fontSize: '2.5rem', color: 'var(--text-muted)', marginBottom: '12px', opacity: 0.4 }} />
                                <p style={{ color: 'var(--text-muted)', margin: 0 }}>No notices posted yet.</p>
                            </div>
                        )}

                        {notices.map(n => (
                            <div key={n._id} className="card" style={{ borderLeft: '4px solid var(--primary-color)', padding: '18px 20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800' }}>{n.title}</h3>
                                    <span style={{
                                        fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600',
                                        backgroundColor: 'var(--bg-color)', padding: '3px 10px', borderRadius: '999px',
                                        border: '1px solid var(--border-color)', whiteSpace: 'nowrap',
                                        display: 'flex', alignItems: 'center', gap: '4px'
                                    }}>
                                        <HiOutlineCalendar style={{ fontSize: '0.85rem' }} />
                                        {formatDate(n.createdAt)}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-color)', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px' }}>
                                    <HiOutlineLocationMarker /> {n.location}
                                </div>
                                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem', lineHeight: '1.6' }}>{n.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default Admin;
