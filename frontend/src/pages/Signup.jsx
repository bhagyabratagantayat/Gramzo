import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HiOutlineUser, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineUserGroup,
    HiOutlineExclamationCircle, HiLightningBolt, HiOutlineMail, HiOutlineLockClosed
} from 'react-icons/hi';
import api from '../services/api';

const Signup = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        location: '',
        role: 'User'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim() || !formData.phone.trim()) {
            setError('Please fill in all required fields.');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        setError(null);
        setLoading(true);

        try {
            const res = await api.post('/auth/register', {
                ...formData,
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim()
            });

            if (res.data.success) {
                const { user } = res.data;
                signup(user); // No more token

                // Redirect based on role
                if (user.role === 'Admin') {
                    navigate('/admin');
                } else if (user.role === 'Agent') {
                    navigate('/agent');
                } else {
                    navigate('/');
                }
            } else {
                setError(res.data.error || 'Registration failed');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.error || 'Failed to create account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const iconStyle = (top = '50%') => ({
        position: 'absolute', left: '14px', top,
        transform: top === '50%' ? 'translateY(-50%)' : undefined,
        color: 'var(--text-muted)', fontSize: '1.1rem', pointerEvents: 'none'
    });

    const fields = [
        { name: 'name', type: 'text', icon: HiOutlineUser, placeholder: 'Full name', label: 'Full Name' },
        { name: 'phone', type: 'tel', icon: HiOutlinePhone, placeholder: '10-digit mobile', label: 'Phone Number' },
        { name: 'location', type: 'text', icon: HiOutlineLocationMarker, placeholder: 'Village or city', label: 'Location' }
    ];

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            minHeight: 'calc(100vh - 72px)', backgroundColor: 'var(--bg-color)', padding: '24px'
        }}>
            <div style={{ width: '100%', maxWidth: '440px' }}>

                {/* Brand */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <HiLightningBolt style={{ color: 'var(--primary-color)', fontSize: '2rem' }} />
                        <span style={{ fontSize: '1.6rem', fontWeight: '900', letterSpacing: '-0.04em' }}>Gramzo</span>
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '900', margin: '0 0 8px', letterSpacing: '-0.025em' }}>Create your account</h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Join thousands of community members on Gramzo</p>
                </div>

                <div className="card" style={{ padding: '32px', borderRadius: '20px', boxShadow: '0 16px 40px rgba(0,0,0,0.1)' }}>

                    {error && (
                        <div className="alert alert-error">
                            <HiOutlineExclamationCircle style={{ flexShrink: 0 }} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <HiOutlineUser style={iconStyle()} />
                                <input
                                    type="text"
                                    name="name"
                                    className="form-input"
                                    placeholder="Your Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    style={{ paddingLeft: '40px' }}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <HiOutlineMail style={iconStyle()} />
                                <input
                                    type="email"
                                    name="email"
                                    className="form-input"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    style={{ paddingLeft: '40px' }}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <div style={{ position: 'relative' }}>
                                <HiOutlinePhone style={iconStyle()} />
                                <input
                                    type="tel"
                                    name="phone"
                                    className="form-input"
                                    placeholder="10-digit mobile"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    style={{ paddingLeft: '40px' }}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div style={{ position: 'relative' }}>
                                <HiOutlineLockClosed style={iconStyle()} />
                                <input
                                    type="password"
                                    name="password"
                                    className="form-input"
                                    placeholder="At least 6 characters"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    style={{ paddingLeft: '40px' }}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Location (Optional)</label>
                            <div style={{ position: 'relative' }}>
                                <HiOutlineLocationMarker style={iconStyle()} />
                                <input
                                    type="text"
                                    name="location"
                                    className="form-input"
                                    placeholder="Village or city"
                                    value={formData.location}
                                    onChange={handleChange}
                                    style={{ paddingLeft: '40px' }}
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '28px' }}>
                            <label className="form-label">Join As</label>
                            <div style={{ position: 'relative' }}>
                                <HiOutlineUserGroup style={iconStyle()} />
                                <select
                                    name="role"
                                    className="form-select"
                                    value={formData.role}
                                    onChange={handleChange}
                                    style={{ paddingLeft: '40px' }}
                                >
                                    <option value="User">User — Book services</option>
                                    <option value="Agent">Agent Partner — Offer services</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                            style={{ width: '100%', padding: '14px', fontSize: '1rem', justifyContent: 'center', borderRadius: '12px' }}
                        >
                            {loading ? (
                                <><span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> Creating account...</>
                            ) : 'Create Account'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '24px', marginBottom: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '700' }}>
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
