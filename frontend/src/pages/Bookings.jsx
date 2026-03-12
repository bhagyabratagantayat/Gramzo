import { useState, useEffect } from 'react';
import api from '../services/api';
import { getUser } from '../services/auth';
import {
    HiOutlineCalendar,
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineRefresh,
    HiOutlineClipboardList,
    HiOutlineInformationCircle
} from 'react-icons/hi';

const statusConfig = {
    pending: {
        label: 'Pending',
        color: '#b45309',
        bg: '#fffbeb',
        border: '#fde68a',
        icon: HiOutlineClock
    },
    accepted: {
        label: 'Accepted',
        color: '#1d4ed8',
        bg: '#eff6ff',
        border: '#bfdbfe',
        icon: HiOutlineRefresh
    },
    completed: {
        label: 'Completed',
        color: '#065f46',
        bg: '#ecfdf5',
        border: '#6ee7b7',
        icon: HiOutlineCheckCircle
    }
};

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = getUser();

    useEffect(() => {
        const fetchMyBookings = async () => {
            if (!user?.phone) {
                setLoading(false);
                return;
            }
            try {
                const res = await api.get('/user/bookings');
                setBookings(res.data.data || []);
            } catch (err) {
                console.error('Failed to fetch bookings:', err);
                setError('Could not load your bookings. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchMyBookings();
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="bookings-container app-container py-8">
            {/* Header */}
            <header className="dash-header mb-12">
                <div className="dash-title-group">
                    <div className="dash-eyebrow">Your Activity</div>
                    <h1 className="dash-title">My Bookings</h1>
                    <p className="dash-subtitle">Track and manage all your service appointments in one place.</p>
                </div>
            </header>

            {/* Error */}
            {error && (
                <div className="alert alert-error mb-8 p-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 flex items-center gap-3">
                    <HiOutlineInformationCircle className="shrink-0 text-xl" />
                    <span className="font-bold">{error}</span>
                </div>
            )}

            {/* No phone stored */}
            {!loading && !error && !user?.phone && (
                <div className="empty-state py-16 bg-white-bleed rounded-[32px]">
                    <HiOutlineClipboardList className="empty-state-icon opacity-10" />
                    <h3 className="text-xl font-black mb-2">No phone number linked</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">Your bookings are matched by phone number. Please ensure your profile has one to see your history.</p>
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && user?.phone && bookings.length === 0 && (
                <div className="empty-state py-16 bg-white-bleed rounded-[32px]">
                    <HiOutlineCalendar className="empty-state-icon opacity-10" />
                    <h3 className="text-xl font-black mb-2">No bookings yet</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">Head over to <strong>Services</strong> to book your first appointment and see it appear here.</p>
                </div>
            )}

            {/* Booking list */}
            {!loading && !error && bookings.length > 0 && (
                <div className="dash-card">
                    <div className="dash-card-header">
                        <h2>Recent Appointments</h2>
                    </div>
                    <div className="dash-list">
                        {bookings.map((booking) => {
                            const cfg = statusConfig[booking.status] || statusConfig.pending;
                            return (
                                <div key={booking._id} className="dash-row">
                                    <div className="dash-row-info">
                                        <div className="dash-row-title text-base">
                                            {booking.service?.title || 'Service Unavailable'}
                                        </div>
                                        <div className="dash-row-sub flex items-center gap-2">
                                            <HiOutlineCalendar className="text-sm" />
                                            {formatDate(booking.date)}
                                            {booking.service?.location && ` • 📍 ${booking.service.location}`}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        {booking.amount && (
                                            <div className="dash-row-amount">₹{booking.amount}</div>
                                        )}
                                        <span className={`status-badge-flat ${booking.status}`}>
                                            {cfg.label}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bookings;
