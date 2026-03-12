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
const Badge = ({ cfg }) => (
    <span className={`status-badge-flat ${cfg.label.toLowerCase()} px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest`}>
        {cfg.label}
    </span>
);

const agentBadge = (agent) => {
    if (agent.isBlocked) return { label: 'Blocked', color: '#ef4444' };
    if (agent.isApproved) return { label: 'Verified', color: '#10b981' };
    return { label: 'Pending', color: '#f59e0b' };
};

const bookingBadge = (status) => {
    switch (status) {
        case 'pending': return { label: 'Pending', color: '#f59e0b' };
        case 'accepted': return { label: 'Accepted', color: '#10b981' };
        case 'completed': return { label: 'Completed', color: '#3b82f6' };
        case 'rejected': return { label: 'Rejected', color: '#ef4444' };
        default: return { label: 'Unknown', color: '#94a3b8' };
    }
};

const Admin = () => {
    const [tab, setTab] = useState('overview');
    const [agents, setAgents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    const [noticeTitle, setNoticeTitle] = useState('');
    const [noticeDesc, setNoticeDesc] = useState('');
    const [noticeLoc, setNoticeLoc] = useState('');
    const [noticePosting, setNoticePosting] = useState(false);
    const [noticeMsg, setNoticeMsg] = useState(null);

    const fetchAll = async () => {
        try {
            const [agentsRes, bookingsRes, noticesRes] = await Promise.all([
                api.get('/admin/agents'),
                api.get('/admin/bookings'),
                api.get('/notices')
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
            await api.patch(`/admin/approve/${id}`);
            fetchAll();
        } catch { alert('Failed to approve agent.'); }
    };

    const handleBlock = async (id) => {
        try {
            await api.patch(`/admin/block/${id}`);
            fetchAll();
        } catch { alert('Failed to block agent.'); }
    };

    const handleNotice = async (e) => {
        e.preventDefault();
        setNoticePosting(true);
        setNoticeMsg(null);
        try {
            await api.post('/notices', { title: noticeTitle, description: noticeDesc, location: noticeLoc, role: 'Admin' });
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

    if (loading) return (
        <div className="page-loading">
            <div className="spinner"></div>
            <span className="font-bold text-slate-400 mt-4">Loading Command Center...</span>
        </div>
    );

    return (
        <div className="admin-console-container app-container py-8">
            {/* Page Header */}
            <header className="dash-header mb-12">
                <div className="dash-title-group">
                    <div className="dash-eyebrow text-rose-600 font-black">Management Console</div>
                    <h1 className="dash-title flex items-center gap-3">
                        <HiOutlineShieldCheck className="text-rose-600" /> 
                        Admin Dashboard
                    </h1>
                    <p className="dash-subtitle">Complete oversight of agents, appointments, and community updates.</p>
                </div>
            </header>

            {/* Tabs Navigation */}
            <div className="flex overflow-x-auto gap-3 pb-8 mb-4 no-scrollbar">
                {[
                    { id: 'overview', label: 'Overview', icon: HiOutlineChartBar },
                    { id: 'agents', label: `Agents (${agents.length})`, icon: HiOutlineUserGroup },
                    { id: 'bookings', label: `Bookings (${bookings.length})`, icon: HiOutlineCollection },
                    { id: 'notices', label: 'Notice Board', icon: HiOutlineSpeakerphone }
                ].map(item => (
                    <button
                        key={item.id}
                        onClick={() => setTab(item.id)}
                        className={`px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest whitespace-nowrap transition-all flex items-center gap-2 border-2 ${
                            tab === item.id 
                                ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200' 
                                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 shadow-sm'
                        }`}
                    >
                        <item.icon className="text-sm" />
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Tab Contents */}
            <div className="tab-content animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* OVERVIEW TAB */}
                {tab === 'overview' && (
                    <div className="space-y-12">
                        <div className="stat-grid">
                            <div className="dash-card p-8 flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex-center text-3xl shrink-0"><HiOutlineUserGroup /></div>
                                <div>
                                    <div className="text-3xl font-black text-slate-800 tracking-tight">{agents.length}</div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Agents</div>
                                </div>
                            </div>
                            <div className="dash-card p-8 flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex-center text-3xl shrink-0"><HiOutlineCollection /></div>
                                <div>
                                    <div className="text-3xl font-black text-slate-800 tracking-tight">{bookings.length}</div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Bookings</div>
                                </div>
                            </div>
                            <div className="dash-card p-8 flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex-center text-3xl shrink-0"><HiOutlineCheckCircle /></div>
                                <div>
                                    <div className="text-3xl font-black text-slate-800 tracking-tight">{agents.filter(a => a.isApproved && !a.isBlocked).length}</div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Merchants</div>
                                </div>
                            </div>
                            <div className="dash-card p-8 flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex-center text-3xl shrink-0"><HiOutlineClock /></div>
                                <div>
                                    <div className="text-3xl font-black text-slate-800 tracking-tight">{agents.filter(a => !a.isApproved && !a.isBlocked).length}</div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting Approval</div>
                                </div>
                            </div>
                        </div>

                        <div className="dash-card">
                            <div className="dash-card-header">
                                <h2>Recent Platform Activity</h2>
                                <p>The latest 5 service requests globally.</p>
                            </div>
                            <div className="dash-list">
                                {bookings.slice(0, 5).map(b => (
                                    <div key={b._id} className="dash-row">
                                        <div className="dash-row-info">
                                            <div className="dash-row-title">{b.userName}</div>
                                            <div className="dash-row-sub">{b.service?.title || 'Unknown Service'} • {formatDate(b.date)}</div>
                                        </div>
                                        <Badge cfg={bookingBadge(b.status)} />
                                    </div>
                                ))}
                                {bookings.length === 0 && (
                                    <div className="py-12 text-center text-slate-400 font-bold italic">No bookings recorded yet.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* AGENTS TAB */}
                {tab === 'agents' && (
                    <div className="dash-card">
                        <div className="dash-card-header">
                            <h2>Agent Management</h2>
                            <p>Verify merchant credentials and manage platform access.</p>
                        </div>
                        <div className="dash-list">
                            {agents.map(agent => (
                                <div key={agent._id} className="dash-row group">
                                    <div className="dash-row-info">
                                        <div className="dash-row-title text-base">{agent.name}</div>
                                        <div className="dash-row-sub flex items-center gap-4">
                                            <span className="flex items-center gap-1"><HiOutlineLocationMarker /> {agent.location || 'No location'}</span>
                                            <span className="flex items-center gap-1"><HiOutlinePhone /> {agent.phone || 'No phone'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <Badge cfg={agentBadge(agent)} />
                                        <div className="flex gap-2">
                                            {!agent.isApproved && !agent.isBlocked && (
                                                <button onClick={() => handleApprove(agent._id)} className="btn-primary py-2 px-4 rounded-xl text-[10px] bg-emerald-600 border-emerald-600 uppercase font-black tracking-widest">Approve</button>
                                            )}
                                            {agent.isApproved && !agent.isBlocked && (
                                                <button onClick={() => handleBlock(agent._id)} className="btn-primary py-2 px-4 rounded-xl text-[10px] bg-rose-50 text-rose-600 border-rose-100 uppercase font-black tracking-widest hover:bg-rose-600 hover:text-white transition-all">Block Agent</button>
                                            )}
                                            {agent.isBlocked && (
                                                <button onClick={() => handleBlock(agent._id)} className="btn-primary py-2 px-4 rounded-xl text-[10px] bg-blue-50 text-blue-600 border-blue-100 uppercase font-black tracking-widest hover:bg-blue-600 hover:text-white transition-all">Unblock</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {agents.length === 0 && (
                                <div className="py-12 text-center text-slate-400 font-bold italic">No merchants registered.</div>
                            )}
                        </div>
                    </div>
                )}

                {/* BOOKINGS TAB */}
                {tab === 'bookings' && (
                    <div className="dash-card">
                        <div className="dash-card-header">
                            <h2>Universal Booking Register</h2>
                            <p>Full audit trail of every transaction and appointment.</p>
                        </div>
                        <div className="dash-list">
                            {bookings.map(b => (
                                <div key={b._id} className="dash-row">
                                    <div className="dash-row-info">
                                        <div className="dash-row-title leading-tight">{b.userName}</div>
                                        <div className="dash-row-sub font-black text-indigo-600 py-1">{b.service?.title || 'Service Deleted'}</div>
                                        <div className="dash-row-sub flex items-center gap-3">
                                            <span>M: {b.phone || 'N/A'}</span>
                                            <span>• Provider: {b.agent?.name || '—'}</span>
                                            <span>• Date: {formatDate(b.date)}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="dash-row-amount">₹{b.amount || 0}</div>
                                        <Badge cfg={bookingBadge(b.status)} />
                                    </div>
                                </div>
                            ))}
                            {bookings.length === 0 && (
                                <div className="py-12 text-center text-slate-400 font-bold italic">No marketplace activity found.</div>
                            )}
                        </div>
                    </div>
                )}

                {/* NOTICE BOARD TAB */}
                {tab === 'notices' && (
                    <div className="grid lg:grid-cols-5 gap-12">
                        {/* New Notice Form */}
                        <div className="lg:col-span-2">
                            <div className="dash-card p-8">
                                <div className="flex items-center gap-3 mb-8">
                                    <HiOutlinePlus className="text-indigo-600 text-xl" />
                                    <h2 className="text-xl font-black text-slate-800">Post a Notice</h2>
                                </div>

                                {noticeMsg && (
                                    <div className={`mb-8 p-4 rounded-2xl border font-bold text-sm flex items-center gap-3 ${
                                        noticeMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                    }`}>
                                        <HiOutlineBell className="shrink-0" />
                                        {noticeMsg.text}
                                    </div>
                                )}

                                <form onSubmit={handleNotice} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Notice Title</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all"
                                            value={noticeTitle}
                                            onChange={e => setNoticeTitle(e.target.value)}
                                            placeholder="e.g. System Wide Update"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Target Area / Office</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all"
                                            value={noticeLoc}
                                            onChange={e => setNoticeLoc(e.target.value)}
                                            placeholder="e.g. Rampur HQ"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Content description</label>
                                        <textarea
                                            className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all min-h-[140px]"
                                            value={noticeDesc}
                                            onChange={e => setNoticeDesc(e.target.value)}
                                            placeholder="Provide complete details..."
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={noticePosting}
                                        className="btn-primary w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm bg-indigo-600 shadow-xl shadow-indigo-100"
                                    >
                                        {noticePosting ? 'Synchronizing...' : 'Dispatch Notice'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Recent Notices Feed */}
                        <div className="lg:col-span-3 space-y-6">
                            <div className="flex items-center gap-3 mb-2 px-2">
                                <HiOutlineBell className="text-slate-400 text-xl" />
                                <h2 className="text-xl font-black text-slate-800">Platform Broadcasts</h2>
                            </div>

                            {notices.length === 0 && (
                                <div className="dash-card p-16 flex-center flex-col text-center bg-white-bleed border-2 border-dashed border-slate-100">
                                    <HiOutlineBell className="text-slate-100 text-6xl mb-4" />
                                    <p className="text-slate-400 font-bold italic">No active notices on the board.</p>
                                </div>
                            )}

                            {notices.map(n => (
                                <div key={n._id} className="dash-card p-8 border-l-8 border-indigo-600 hover:scale-[1.01] transition-transform cursor-default">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-black text-slate-800 leading-tight">{n.title}</h3>
                                        <span className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                            <HiOutlineCalendar /> {formatDate(n.createdAt)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest mb-4">
                                        <HiOutlineLocationMarker /> {n.location}
                                    </div>
                                    <p className="text-slate-500 leading-relaxed text-sm">{n.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
