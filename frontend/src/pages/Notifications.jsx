import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import notificationService from '../services/notificationService';
import api from '../services/api'; // For booking response triggers
import {
    HiOutlineSpeakerphone,
    HiOutlineCalendar,
    HiOutlineBell,
    HiOutlineTrash,
    HiOutlinePlusCircle,
    HiOutlineCheck,
    HiOutlineX,
    HiOutlineInformationCircle,
    HiOutlineShoppingBag
} from 'react-icons/hi';

const Notifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newNotif, setNewNotif] = useState({ title: '', message: '' });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (loading) setLoading(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, [loading]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const params = {
                role: user?.role,
                userId: user?._id || user?.id,
                phone: user?.phone,
                agentId: user?.role === 'Agent' ? (user?._id || user?.id) : undefined
            };
            const response = await notificationService.getNotifications(params);
            const data = response.data || [];
            setNotifications(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch notifications', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchNotifications();
    }, [user]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this notification?')) return;
        try {
            await notificationService.deleteNotification(id, user.role);
            setNotifications(notifications.filter(n => n._id !== id));
        } catch (err) {
            alert('Failed to delete notification');
        }
    };

    const handleCreateNotif = async (e) => {
        e.preventDefault();
        try {
            await notificationService.createNotification({
                ...newNotif,
                type: 'admin_notice',
                recipientRole: 'All',
                role: user.role,
                senderId: user._id || user.id
            });
            setShowCreateModal(false);
            setNewNotif({ title: '', message: '' });
            fetchNotifications();
        } catch (err) {
            alert('Failed to create notification');
        }
    };

    const handleBookingResponse = async (bookingId, notificationId, status) => {
        try {
            // Update booking status
            await api.patch(`/bookings/respond/${bookingId}`, { status }, {
                headers: {
                    'x-agent-id': user._id || user.id,
                    'x-user-role': user.role
                }
            });

            // Mark notification as "read" or update locally for UX
            alert(`Booking ${status}`);
            fetchNotifications();
        } catch (err) {
            alert('Failed to update booking status');
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'admin_notice': return <HiOutlineSpeakerphone className="notif-type-icon notice" />;
            case 'booking_request': return <HiOutlineCalendar className="notif-type-icon booking" />;
            case 'booking_update': return <HiOutlineInformationCircle className="notif-type-icon update" />;
            case 'order_update': return <HiOutlineShoppingBag className="notif-type-icon order" />;
            default: return <HiOutlineBell />;
        }
    };

    if (loading) return (
        <div className="flex-center" style={{ height: '60vh' }}>
            <div className="spinner"></div>
        </div>
    );

    return (
        <div className="page-wrapper" style={{ maxWidth: '800px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <div className="section-eyebrow">Stay Updated</div>
                    <h1 className="section-title">Notifications</h1>
                </div>
                {user?.role === 'Admin' && (
                    <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                        <HiOutlinePlusCircle /> Post Update
                    </button>
                )}
            </header>

            <div style={{ display: 'grid', gap: '20px' }}>
                {notifications.length === 0 ? (
                    <div className="empty-state">
                        <HiOutlineBell className="empty-icon" />
                        <h3>No notifications</h3>
                        <p>You're all caught up! Important updates will appear here.</p>
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div key={notif._id} className="notif-card">
                            <div className="notif-card-main">
                                <div className="notif-icon-box">
                                    {getIcon(notif.type)}
                                    {notif.type === 'admin_notice' && (
                                        <div className="service-card-badge" style={{ fontSize: '0.6rem', padding: '2px 6px', top: '-6px', right: '-6px' }}>
                                            Notice
                                        </div>
                                    )}
                                </div>
                                <div className="notif-content">
                                    <div className="notif-header">
                                        <h3 className="notif-title">{notif.title}</h3>
                                        <span className="notif-date">
                                            {new Date(notif.createdAt).toLocaleString('en-IN', {
                                                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                    <p className="notif-message">{notif.message}</p>

                                    {notif.type === 'booking_request' && user?.role === 'Agent' && (
                                        <div className="notif-actions">
                                            <button
                                                className="btn-action accept"
                                                onClick={() => handleBookingResponse(notif.bookingId, notif._id, 'accepted')}
                                            >
                                                <HiOutlineCheck /> Accept
                                            </button>
                                            <button
                                                className="btn-action reject"
                                                onClick={() => handleBookingResponse(notif.bookingId, notif._id, 'rejected')}
                                            >
                                                <HiOutlineX /> Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {user?.role === 'Admin' && notif.type === 'admin_notice' && (
                                <button className="notif-delete-btn" onClick={() => handleDelete(notif._id)}>
                                    <HiOutlineTrash />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Create Notification</h2>
                            <button className="close-btn" onClick={() => setShowCreateModal(false)}><HiOutlineX /></button>
                        </div>
                        <form onSubmit={handleCreateNotif}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    required
                                    value={newNotif.title}
                                    onChange={e => setNewNotif({ ...newNotif, title: e.target.value })}
                                    placeholder="e.g. System Maintenance"
                                />
                            </div>
                            <div className="form-group">
                                <label>Message</label>
                                <textarea
                                    rows="4"
                                    required
                                    value={newNotif.message}
                                    onChange={e => setNewNotif({ ...newNotif, message: e.target.value })}
                                    placeholder="Provide details..."
                                ></textarea>
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Post Notification</button>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .notif-card {
                    background: #fff;
                    border-radius: 16px;
                    padding: 20px;
                    border: 1px solid var(--border-color);
                    display: flex;
                    justify-content: space-between;
                    position: relative;
                    transition: all 0.2s ease;
                }
                .notif-card:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                    transform: translateY(-2px);
                }
                .notif-card-main {
                    display: flex;
                    gap: 20px;
                    flex: 1;
                }
                .notif-icon-box {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f8fafc;
                    flex-shrink: 0;
                }
                .notif-type-icon { font-size: 1.5rem; }
                .notif-type-icon.notice { color: #f59e0b; }
                .notif-type-icon.booking { color: #3b82f6; }
                .notif-type-icon.update { color: #10b981; }
                .notif-type-icon.order { color: #8b5cf6; }

                .notif-content { flex: 1; }
                .notif-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
                .notif-title { margin: 0; font-size: 1.1rem; font-weight: 700; color: var(--text-main); }
                .notif-date { font-size: 0.8rem; color: var(--text-muted); }
                .notif-message { margin: 0; color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; }

                .notif-actions { display: flex; gap: 12px; margin-top: 16px; }
                .btn-action {
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    cursor: pointer;
                    border: none;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                }
                .btn-action.accept { background: #ecfdf5; color: #10b981; }
                .btn-action.accept:hover { background: #d1fae5; }
                .btn-action.reject { background: #fef2f2; color: #ef4444; }
                .btn-action.reject:hover { background: #fee2e2; }

                .notif-delete-btn {
                    padding: 8px;
                    color: #94a3b8;
                    cursor: pointer;
                    background: none;
                    border: none;
                    border-radius: 6px;
                    transition: all 0.2s;
                    height: fit-content;
                }
                .notif-delete-btn:hover { background: #f1f5f9; color: #ef4444; }

                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 20px;
                }
                .modal-content {
                    background: #fff;
                    width: 100%;
                    max-width: 500px;
                    border-radius: 20px;
                    padding: 32px;
                }
                .modal-header h2 { margin: 0; font-size: 1.5rem; font-weight: 800; }
                .form-group { margin-bottom: 20px; }
                .form-group label { display: block; margin-bottom: 8px; font-weight: 600; font-size: 0.9rem; }
                .form-group input, .form-group textarea {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid var(--border-color);
                    border-radius: 10px;
                    font-family: inherit;
                }

                .empty-state {
                    text-align: center;
                    padding: 80px 20px;
                    background: #fff;
                    border-radius: 20px;
                    border: 1px dashed var(--border-color);
                }
                .empty-icon { font-size: 4rem; color: var(--border-color); margin-bottom: 16px; }
            `}</style>
        </div>
    );
};

export default Notifications;
