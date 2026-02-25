import { useState } from 'react';
import api from '../services/api';
import { getUser } from '../services/auth';
import { HiOutlineCalendar, HiX, HiOutlineCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi';

const BookingForm = ({ serviceId, serviceTitle, onClose }) => {
    const loggedUser = getUser();

    const [userName, setUserName] = useState(loggedUser?.name || '');
    const [phone, setPhone] = useState(loggedUser?.phone || '');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    // Min date = today
    const today = new Date().toISOString().split('T')[0];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await api.post('/bookings/create', { userName, phone, serviceId, date });
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
                overflow: 'hidden',
                animation: 'none'
            }}>
                {/* Modal Header */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'linear-gradient(135deg, #eff6ff, #fff)'
                }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                            New Appointment
                        </div>
                        <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)' }}>
                            {serviceTitle}
                        </h2>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'var(--bg-color)', border: '1px solid var(--border-color)',
                        borderRadius: '8px', padding: '6px', display: 'flex', cursor: 'pointer',
                        color: 'var(--text-muted)', transition: 'var(--transition)'
                    }}>
                        <HiX style={{ fontSize: '1.1rem' }} />
                    </button>
                </div>

                {/* Modal Body */}
                <div style={{ padding: '24px' }}>

                    {/* Success state */}
                    {success && (
                        <div style={{ textAlign: 'center', padding: '24px 0' }}>
                            <HiOutlineCheckCircle style={{ fontSize: '3.5rem', color: 'var(--success-color)', marginBottom: '12px' }} />
                            <h3 style={{ margin: '0 0 8px', fontWeight: '800' }}>Booking Confirmed!</h3>
                            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Your appointment has been successfully created.</p>
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

                            <div className="form-group" style={{ marginBottom: '24px' }}>
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

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary"
                                    style={{ flex: 1, padding: '13px', fontSize: '0.95rem', justifyContent: 'center' }}
                                >
                                    {loading ? (
                                        <><span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> Booking...</>
                                    ) : 'Confirm Booking'}
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
