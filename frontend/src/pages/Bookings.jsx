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
                const res = await api.get(`/bookings?phone=${encodeURIComponent(user.phone)}`);
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
        <div className="page-wrapper" style={{ maxWidth: '900px' }}>
            {/* Header */}
            <header style={{ marginBottom: '40px' }}>
                <div style={{
                    color: 'var(--primary-color)',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}>
                    <HiOutlineClipboardList style={{ fontSize: '1rem' }} />
                    Your Activity
                </div>
                <h1 style={{ margin: 0, fontSize: '2.25rem', fontWeight: '900', letterSpacing: '-0.025em' }}>
                    My Bookings
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '10px' }}>
                    Track and manage all your service appointments in one place.
                </p>
            </header>

            {/* Loading */}
            {loading && (
                <div className="page-loading">
                    <div className="spinner" />
                    <span>Loading your bookings...</span>
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="alert alert-error">
                    <HiOutlineInformationCircle style={{ flexShrink: 0 }} />
                    {error}
                </div>
            )}

            {/* No phone stored */}
            {!loading && !error && !user?.phone && (
                <div className="empty-state">
                    <HiOutlineClipboardList className="empty-state-icon" />
                    <h3>No phone number linked</h3>
                    <p>Your bookings are matched by phone number. Please ensure your profile has one.</p>
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && user?.phone && bookings.length === 0 && (
                <div className="empty-state">
                    <HiOutlineCalendar className="empty-state-icon" />
                    <h3>No bookings yet</h3>
                    <p>Head over to <strong>Services</strong> to book your first appointment.</p>
                </div>
            )}

            {/* Booking list */}
            {!loading && !error && bookings.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {bookings.map((booking) => {
                        const cfg = statusConfig[booking.status] || statusConfig.pending;
                        const StatusIcon = cfg.icon;
                        return (
                            <div
                                key={booking._id}
                                className="card"
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr auto',
                                    gap: '16px',
                                    alignItems: 'center',
                                    padding: '24px 28px'
                                }}
                            >
                                {/* Left: Info */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{
                                        fontSize: '1.15rem',
                                        fontWeight: '800',
                                        color: 'var(--text-main)'
                                    }}>
                                        {booking.service?.title || 'Service Unavailable'}
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        color: 'var(--text-muted)',
                                        fontSize: '0.9rem',
                                        fontWeight: '600'
                                    }}>
                                        <HiOutlineCalendar style={{ flexShrink: 0 }} />
                                        {formatDate(booking.date)}
                                    </div>

                                    {booking.service?.location && (
                                        <div style={{
                                            fontSize: '0.85rem',
                                            color: 'var(--text-muted)',
                                            fontWeight: '500'
                                        }}>
                                            📍 {booking.service.location}
                                        </div>
                                    )}

                                    {booking.amount && (
                                        <div style={{
                                            fontSize: '0.85rem',
                                            color: 'var(--text-muted)',
                                            fontWeight: '600'
                                        }}>
                                            ₹{booking.amount}
                                        </div>
                                    )}
                                </div>

                                {/* Right: Status badge */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    backgroundColor: cfg.bg,
                                    color: cfg.color,
                                    border: `1px solid ${cfg.border}`,
                                    padding: '8px 16px',
                                    borderRadius: '999px',
                                    fontWeight: '700',
                                    fontSize: '0.85rem',
                                    whiteSpace: 'nowrap'
                                }}>
                                    <StatusIcon style={{ fontSize: '1rem' }} />
                                    {cfg.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Bookings;
