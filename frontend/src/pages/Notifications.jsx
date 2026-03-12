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
            // Update booking status using the correct Agent endpoint
            await api.patch(`/bookings/respond/${bookingId}`, { status });

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
        <div className="notifications-container app-container py-8">
            <header className="dash-header mb-12">
                <div className="dash-title-group">
                    <div className="dash-eyebrow">Stay Updated</div>
                    <h1 className="dash-title">Notifications</h1>
                    <p className="dash-subtitle">Important updates, booking requests, and community news.</p>
                </div>
                {user?.role === 'Admin' && (
                    <button className="btn-primary flex items-center gap-2 py-3 px-6 rounded-2xl" onClick={() => setShowCreateModal(true)}>
                        <HiOutlinePlusCircle className="text-xl" /> 
                        <span className="font-extrabold text-sm uppercase">Post Update</span>
                    </button>
                )}
            </header>

            <div className="dash-card">
                {notifications.length === 0 ? (
                    <div className="empty-state py-20 bg-white-bleed rounded-[32px]">
                        <div className="w-20 h-20 rounded-full bg-slate-50 flex-center mx-auto mb-6 text-slate-200 text-4xl">
                            <HiOutlineBell />
                        </div>
                        <h3 className="text-xl font-black mb-2">No notifications yet</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">You're all caught up! Important updates will appear here as they arrive.</p>
                    </div>
                ) : (
                    <div className="dash-list">
                        {notifications.map((notif) => (
                            <div key={notif._id} className="dash-row group">
                                <div className="flex gap-5 flex-1 min-w-0">
                                    <div className={`notification-icon-wrapper rounded-2xl flex-center w-14 h-14 shrink-0 transition-transform group-hover:scale-105 ${
                                        notif.type === 'admin_notice' ? 'bg-amber-50 text-amber-600' :
                                        notif.type === 'booking_request' ? 'bg-blue-50 text-blue-600' :
                                        notif.type === 'booking_update' ? 'bg-emerald-50 text-emerald-600' :
                                        'bg-purple-50 text-purple-600'
                                    }`}>
                                        <div className="text-2xl">{getIcon(notif.type)}</div>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-black text-slate-800 text-lg leading-tight truncate pr-4">
                                                {notif.title}
                                            </h3>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap bg-slate-50 px-2 py-1 rounded">
                                                {new Date(notif.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric', month: 'short'
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-4">
                                            {notif.message}
                                        </p>

                                        {notif.type === 'booking_request' && user?.role === 'Agent' && (
                                            <div className="flex gap-3 pt-2">
                                                <button
                                                    className="btn-primary py-2 px-5 rounded-xl text-xs bg-emerald-600 border-emerald-600 hover:bg-emerald-700 font-extrabold uppercase flex items-center gap-2"
                                                    onClick={() => handleBookingResponse(notif.bookingId, notif._id, 'accepted')}
                                                >
                                                    <HiOutlineCheck /> Accept
                                                </button>
                                                <button
                                                    className="btn-primary py-2 px-5 rounded-xl text-xs bg-white text-slate-600 border-slate-200 hover:bg-slate-50 font-extrabold uppercase flex items-center gap-2"
                                                    onClick={() => handleBookingResponse(notif.bookingId, notif._id, 'rejected')}
                                                >
                                                    <HiOutlineX /> Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {user?.role === 'Admin' && notif.type === 'admin_notice' && (
                                    <button 
                                        className="w-10 h-10 rounded-xl flex-center text-slate-300 hover:bg-rose-50 hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100"
                                        onClick={() => handleDelete(notif._id)}
                                    >
                                        <HiOutlineTrash />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-[1000] flex-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-8 pb-0 flex justify-between items-center">
                            <h2 className="text-2xl font-black text-slate-800">New Public Notice</h2>
                            <button className="w-10 h-10 rounded-full bg-slate-50 flex-center text-slate-400 hover:bg-slate-100 transition-colors" onClick={() => setShowCreateModal(false)}>
                                <HiOutlineX className="text-xl" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateNotif} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Notice Title</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all"
                                    required
                                    value={newNotif.title}
                                    onChange={e => setNewNotif({ ...newNotif, title: e.target.value })}
                                    placeholder="e.g. System Maintenance"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Message Content</label>
                                <textarea
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all min-h-[120px]"
                                    required
                                    value={newNotif.message}
                                    onChange={e => setNewNotif({ ...newNotif, message: e.target.value })}
                                    placeholder="Provide details about the update..."
                                ></textarea>
                            </div>
                            <button type="submit" className="btn-primary w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm bg-indigo-600 shadow-xl shadow-indigo-100 hover:shadow-indigo-200 transition-all">
                                Post to Platform
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;
