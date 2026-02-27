import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HiOutlineUser, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineUserGroup,
    HiOutlineExclamationCircle, HiLightningBolt
} from 'react-icons/hi';

const Signup = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ name: '', phone: '', location: '', role: 'User' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.phone.trim()) {
            setError('Please fill in all required fields.');
            return;
        }
        setError(null);
        setLoading(true);

        let userData = { ...formData, name: formData.name.trim(), phone: formData.phone.trim() };

        if (formData.role === 'Agent') {
            try {
                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const res = await fetch(`${baseUrl}/agents/add`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: userData.name,
                        phone: userData.phone,
                        location: userData.location || 'Default'
                    })
                });
                const result = await res.json();
                if (result.success) {
                    userData._id = result.data._id;
                } else {
                    setError('Agent registration failed: ' + (result.error || 'Unknown error'));
                    setLoading(false);
                    return;
                }
            } catch {
                setError('Connection error. Could not register agent.');
                setLoading(false);
                return;
            }
        } else {
            // For Users/Admins, simulate an ID for consistency
            userData._id = 'user_' + Date.now();
        }

        login(userData);
        setLoading(false);
        navigate(formData.role === 'User' ? '/' : '/dashboard');
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
                        {fields.map(({ name, type, icon: Icon, placeholder, label }) => (
                            <div key={name} className="form-group">
                                <label className="form-label">{label}</label>
                                <div style={{ position: 'relative' }}>
                                    <Icon style={iconStyle()} />
                                    <input
                                        type={type}
                                        name={name}
                                        className="form-input"
                                        placeholder={placeholder}
                                        value={formData[name]}
                                        onChange={handleChange}
                                        required
                                        style={{ paddingLeft: '40px' }}
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Role selector */}
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
