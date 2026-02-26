import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    HiOutlineUser, HiOutlinePhone,
    HiOutlineExclamationCircle, HiLightningBolt
} from 'react-icons/hi';

const Login = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(null); // 'User' | 'Agent' | 'Admin' | null
    const [error, setError] = useState(null);

    const handleLogin = async (role) => {
        if (!name.trim() || !phone.trim()) {
            setError('Please fill in your name and phone number.');
            return;
        }
        setError(null);
        setLoading(role);

        let userData = { name: name.trim(), phone: phone.trim(), role };

        if (role === 'Agent') {
            try {
                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const res = await fetch(`${baseUrl}/agents/add`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: name.trim(), phone: phone.trim(), location: 'Default' })
                });
                const result = await res.json();
                if (result.success) {
                    userData._id = result.data._id;
                } else {
                    setError('Agent sign-in failed: ' + (result.error || 'Unknown error'));
                    setLoading(null);
                    return;
                }
            } catch {
                setError('Connection error. Make sure the server is running.');
                setLoading(null);
                return;
            }
        }

        localStorage.setItem('gramzoUser', JSON.stringify(userData));
        setLoading(null);
        navigate('/dashboard');
    };

    const iconStyle = {
        position: 'absolute', left: '14px', top: '50%',
        transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '1.15rem',
        pointerEvents: 'none'
    };

    const roleButtons = [
        { role: 'User', label: 'Sign in as User', color: 'var(--primary-color)' },
        { role: 'Agent', label: 'Sign in as Agent', color: '#059669' },
        { role: 'Admin', label: 'Sign in as Admin', color: '#0f172a' }
    ];

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            minHeight: 'calc(100vh - 72px)', backgroundColor: 'var(--bg-color)', padding: '24px'
        }}>
            <div style={{ width: '100%', maxWidth: '420px' }}>

                {/* Brand mark */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                        <HiLightningBolt style={{ color: 'var(--primary-color)', fontSize: '2rem' }} />
                        <span style={{ fontSize: '1.6rem', fontWeight: '900', letterSpacing: '-0.04em' }}>Gramzo</span>
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '900', margin: '0 0 8px', letterSpacing: '-0.025em' }}>Welcome back</h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Enter your details to sign in</p>
                </div>

                <div className="card" style={{ padding: '32px', borderRadius: '20px', boxShadow: '0 16px 40px rgba(0,0,0,0.1)' }}>

                    {error && (
                        <div className="alert alert-error">
                            <HiOutlineExclamationCircle style={{ flexShrink: 0 }} />
                            {error}
                        </div>
                    )}

                    {/* Name */}
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <HiOutlineUser style={iconStyle} />
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Your full name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                style={{ paddingLeft: '40px' }}
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="form-group" style={{ marginBottom: '28px' }}>
                        <label className="form-label">Phone Number</label>
                        <div style={{ position: 'relative' }}>
                            <HiOutlinePhone style={iconStyle} />
                            <input
                                type="tel"
                                className="form-input"
                                placeholder="10-digit mobile number"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                style={{ paddingLeft: '40px' }}
                            />
                        </div>
                    </div>

                    {/* Role buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {roleButtons.map(({ role, label, color }) => (
                            <button
                                key={role}
                                onClick={() => handleLogin(role)}
                                disabled={!!loading}
                                style={{
                                    width: '100%', padding: '14px',
                                    backgroundColor: loading === role ? color : color,
                                    opacity: loading && loading !== role ? 0.55 : 1,
                                    color: '#fff', border: 'none',
                                    borderRadius: '12px', fontWeight: '700',
                                    fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    transition: 'var(--transition)',
                                    boxShadow: loading === role ? `0 4px 14px ${color}55` : 'none',
                                    transform: loading === role ? 'scale(0.99)' : 'scale(1)'
                                }}
                            >
                                {loading === role ? (
                                    <><span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> Signing in...</>
                                ) : label}
                            </button>
                        ))}
                    </div>

                    <p style={{ textAlign: 'center', marginTop: '24px', marginBottom: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        New to Gramzo?{' '}
                        <Link to="/signup" style={{ color: 'var(--primary-color)', fontWeight: '700' }}>
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
