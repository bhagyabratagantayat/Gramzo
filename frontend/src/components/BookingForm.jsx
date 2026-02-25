import { useState } from 'react';
import api from '../services/api';
import { getUser } from '../services/auth';
import {
    HiOutlineCalendar, HiOutlineClock,
    HiX, HiOutlineCheckCircle, HiOutlineExclamationCircle,
    HiOutlineLightningBolt
} from 'react-icons/hi';

/**
 * BookingForm
 *
 * Props:
 *   serviceId            – MongoDB ID of the service
 *   serviceTitle         – Display name
 *   requiresAppointment  – Boolean. true = show date+time picker, false = instant Book Now
 *   onClose              – Callback to close the modal
 */
const BookingForm = ({ serviceId, serviceTitle, requiresAppointment = false, onClose }) => {
    const loggedUser = getUser();

    const [userName, setUserName] = useState(loggedUser?.name || '');
    const [phone, setPhone] = useState(loggedUser?.phone || '');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const today = new Date().toISOString().split('T')[0];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = { userName, phone, serviceId };
        if (requiresAppointment) {
            payload.date = date;
            if (time) payload.time = time;
        }

        try {
            await api.post('/bookings/create', payload);
            setSuccess(true);
            setTimeout(() => onClose(), 2200);
        } catch (err) {
            setError(err.response?.data?.error || 'Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(15,23,42,0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 2000, padding: '20px'
        }}>
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '440px',
                boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
                overflow: 'hidden'
            }}>
                {/* Modal Header */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: requiresAppointment
                        ? 'linear-gradient(135deg, #eff6ff, #fff)'
                        : 'linear-gradient(135deg, #ecfdf5, #fff)'
                }}>
                    <div>
                        <div style={{
                            fontSize: '0.75rem', fontWeight: '700',
                            color: requiresAppointment ? 'var(--primary-color)' : 'var(--success-color)',
                            textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px'
                        }}>
                            {requiresAppointment ? 'Schedule Appointment' : 'Instant Booking'}
                        </div>
                        <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800' }}>
                            {serviceTitle}
                        </h2>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'var(--bg-color)', border: '1px solid var(--border-color)',
                        borderRadius: '8px', padding: '6px', display: 'flex',
                        cursor: 'pointer', color: 'var(--text-muted)'
                    }}>
                        <HiX style={{ fontSize: '1.1rem' }} />
                    </button>
                </div>

                {/* Modal Body */}
                <div style={{ padding: '24px' }}>

                    {/* Success */}
                    {success && (
                        <div style={{ textAlign: 'center', padding: '24px 0' }}>
                            <HiOutlineCheckCircle style={{ fontSize: '3.5rem', color: 'var(--success-color)', marginBottom: '12px' }} />
                            <h3 style={{ margin: '0 0 8px', fontWeight: '800' }}>
                                {requiresAppointment ? 'Appointment Confirmed!' : 'Booking Confirmed!'}
                            </h3>
                            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                                {requiresAppointment
                                    ? `Your appointment has been scheduled for ${date}${time ? ' at ' + time : ''}.`
                                    : 'Your booking has been created successfully.'}
                            </p>
                        </div>
                    )}

                    {/* Form */}
                    {!success && (
                        <form onSubmit={handleSubmit}>
                            {error && (
                                <div className="alert alert-error" style={{ marginBottom: '20px' }}>
                                    <HiOutlineExclamationCircle style={{ flexShrink: 0 }} />
                                    {error}
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label">Your Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Full name"
                                    value={userName}
                                    onChange={e => setUserName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    placeholder="10-digit mobile number"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Date + Time — only for appointment-based services */}
                            {requiresAppointment && (
                                <>
                                    <div className="form-group">
                                        <label className="form-label">Preferred Date</label>
                                        <div style={{ position: 'relative' }}>
                                            <HiOutlineCalendar style={{
                                                position: 'absolute', left: '12px', top: '50%',
                                                transform: 'translateY(-50%)', color: 'var(--text-muted)',
                                                fontSize: '1.1rem', pointerEvents: 'none'
                                            }} />
                                            <input
                                                type="date"
                                                className="form-input"
                                                min={today}
                                                value={date}
                                                onChange={e => setDate(e.target.value)}
                                                required
                                                style={{ paddingLeft: '38px' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '24px' }}>
                                        <label className="form-label">Preferred Time <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>(optional)</span></label>
                                        <div style={{ position: 'relative' }}>
                                            <HiOutlineClock style={{
                                                position: 'absolute', left: '12px', top: '50%',
                                                transform: 'translateY(-50%)', color: 'var(--text-muted)',
                                                fontSize: '1.1rem', pointerEvents: 'none'
                                            }} />
                                            <input
                                                type="time"
                                                className="form-input"
                                                value={time}
                                                onChange={e => setTime(e.target.value)}
                                                style={{ paddingLeft: '38px' }}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* No date for instant "Book Now" — info note */}
                            {!requiresAppointment && (
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    backgroundColor: '#ecfdf5', border: '1px solid #6ee7b7',
                                    borderRadius: '10px', padding: '10px 14px',
                                    fontSize: '0.85rem', color: '#065f46',
                                    fontWeight: '600', marginBottom: '20px'
                                }}>
                                    <HiOutlineLightningBolt style={{ flexShrink: 0 }} />
                                    Instant booking — the agent will contact you shortly.
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary"
                                    style={{
                                        flex: 1, padding: '13px', fontSize: '0.95rem',
                                        justifyContent: 'center',
                                        backgroundColor: requiresAppointment ? undefined : 'var(--success-color)'
                                    }}
                                >
                                    {loading ? (
                                        <><span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                                            {requiresAppointment ? 'Scheduling...' : 'Booking...'}</>
                                    ) : (
                                        requiresAppointment ? 'Confirm Appointment' : 'Book Now'
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="btn-ghost"
                                    style={{ padding: '13px 18px' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingForm;
