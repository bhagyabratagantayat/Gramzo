import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
    HiOutlineBell, HiOutlineTrash, HiOutlineCheckCircle,
    HiOutlineXCircle, HiOutlineSpeakerphone, HiOutlineCalendar
} from 'react-icons/hi';

const NotificationPage = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adminForm, setAdminForm] = useState({ title: '', message: '' });

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/api/notifications');
            setNotifications(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch notifications', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.patch(`/api/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error('Failed to mark as read', err);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await api.delete(`/api/notifications/${id}`);
            setNotifications(notifications.filter(n => n._id !== id));
        } catch (err) {
            console.error('Failed to delete notification', err);
        }
    };

    const handleAdminNotice = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/notifications', {
                ...adminForm,
                type: 'admin_notice',
                role: 'Admin'
            });
            setAdminForm({ title: '', message: '' });
            fetchNotifications();
        } catch (err) {
            alert('Failed to post notice');
        }
    };

    const handleBookingResponse = async (notifId, bookingId, status) => {
        try {
            await api.patch(`/api/bookings/respond/${bookingId}`, { status });
            // Mark the notification as read or delete it after responding
            await api.patch(`/api/notifications/${notifId}/read`);
            fetchNotifications();
        } catch (err) {
            alert('Failed to respond to booking: ' + (err.response?.data?.error || err.message));
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'admin_notice': return <HiOutlineSpeakerphone className="notif-icon admin" />;
            case 'booking_request': return <HiOutlineCalendar className="notif-icon booking" />;
            case 'booking_update': return <HiOutlineCheckCircle className="notif-icon update" />;
            default: return <HiOutlineBell className="notif-icon" />;
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
            <div className="spinner"></div>
        </div>
    );

    return (
        <div className="notifications-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <HiOutlineBell /> Notifications
            </h1>

            {user?.role === 'Admin' && (
                <div className="admin-notice-card" style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '40px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 16px', fontWeight: 800 }}>Create Announcement</h3>
                    <form onSubmit={handleAdminNotice} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <input
                            type="text"
                            placeholder="Notice Title"
                            value={adminForm.title}
                            onChange={e => setAdminForm({ ...adminForm, title: e.target.value })}
                            required
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                        />
                        <textarea
                            placeholder="Message body..."
                            value={adminForm.message}
                            onChange={e => setAdminForm({ ...adminForm, message: e.target.value })}
                            required
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', minHeight: '80px' }}
                        />
                        <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>Post Notice</button>
                    </form>
                </div>
            )}

            <div className="notifications-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {notifications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                        <HiOutlineBell style={{ fontSize: '3rem', opacity: 0.2, marginBottom: '16px' }} />
                        <p style={{ fontWeight: 600 }}>No notifications available.</p>
                    </div>
                ) : (
                    notifications.map(notif => (
                        <div key={notif._id} className={`notif-card ${notif.isRead ? 'read' : 'unread'}`} style={{
                            background: '#fff',
                            padding: '24px',
                            borderRadius: '16px',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            gap: '20px',
                            position: 'relative',
                            transition: 'all 0.2s',
                            opacity: notif.isRead ? 0.8 : 1,
                            boxShadow: notif.isRead ? 'none' : '0 10px 15px -3px rgba(0,0,0,0.05)',
                            cursor: notif.isRead ? 'default' : 'pointer'
                        }} onClick={() => !notif.isRead && markAsRead(notif._id)}>
                            <div className="notif-icon-wrapper" style={{ flexShrink: 0 }}>
                                {getIcon(notif.type)}
                            </div>
                            <div className="notif-body" style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 4px', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>{notif.title}</h4>
                                        {(notif.customerName || notif.serviceName) && (
                                            <p style={{ margin: '0 0 6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-color)' }}>
                                                {notif.serviceName} {notif.customerName && `• ${notif.customerName}`}
                                            </p>
                                        )}
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{new Date(notif.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.5 }}>{notif.message}</p>

                                {notif.type === 'booking_request' && user?.role === 'Agent' && !notif.isRead && (
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }} onClick={e => e.stopPropagation()}>
                                        <button
                                            onClick={() => handleBookingResponse(notif._id, notif.bookingId, 'accepted')}
                                            className="btn-primary"
                                            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                                        >
                                            Accept Booking
                                        </button>
                                        <button
                                            onClick={() => handleBookingResponse(notif._id, notif.bookingId, 'rejected')}
                                            className="btn-danger"
                                            style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'var(--danger-light)', color: 'var(--danger-color)', border: 'none' }}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); deleteNotification(notif._id); }}
                                style={{ background: 'none', border: 'none', color: '#ef4444', opacity: 0.3, cursor: 'pointer', padding: '4px', position: 'absolute', right: '16px', top: '16px' }}
                                onMouseOver={e => e.currentTarget.style.opacity = 1}
                                onMouseOut={e => e.currentTarget.style.opacity = 0.3}
                            >
                                <HiOutlineTrash />
                            </button>
                            {!notif.isRead && <div style={{ width: '8px', height: '8px', background: 'var(--primary-color)', borderRadius: '50%', position: 'absolute', left: '-4px', top: '50%', transform: 'translateY(-50%)' }}></div>}
                        </div>
                    ))
                )}
            </div>

            <style>{`
                .notif-icon { font-size: 1.5rem; padding: 12px; borderRadius: 14px; }
                .notif-icon.admin { background: #fef3c7; color: #d97706; }
                .notif-icon.booking { background: #e0f2fe; color: #0284c7; }
                .notif-icon.update { background: #d1fae5; color: #059669; }
                .notif-card.unread { border-left: 4px solid var(--primary-color); background: #f8fafc !important; }
                .notif-card:hover { transform: translateY(-2px); border-color: var(--primary-color); }
                .btn-danger { transition: all 0.2s; border-radius: 8px; font-weight: 700; cursor: pointer; }
                .btn-danger:hover { background: var(--danger-color) !important; color: #fff !important; }
            `}</style>
        </div>
    );
};

export default NotificationPage;
