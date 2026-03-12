import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
    HiOutlineMail, HiOutlineLockClosed,
    HiOutlineExclamationCircle, HiLightningBolt
} from 'react-icons/hi';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            setError('Please fill in all fields.');
            return;
        }
        setError(null);
        setLoading(true);

        try {
            const res = await api.post('/auth/login', { email: email.trim(), password });

            if (res.data.success) {
                const { user, accessToken } = res.data;
                login(user, accessToken); // Pass token to context

                // Redirect based on role
                if (user.role === 'Admin') {
                    navigate('/admin');
                } else if (user.role === 'Agent') {
                    navigate('/agent');
                } else {
                    navigate('/');
                }
            } else {
                setError(res.data.error || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            if (err.message === 'Network Error') {
                setError('Connection error. Please check your internet or try again later.');
            } else {
                setError(err.response?.data?.error || 'Invalid email or password.');
            }
        } finally {
            setLoading(false);
        }
    };

    const iconStyle = {
        position: 'absolute', left: '14px', top: '50%',
        transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '1.15rem',
        pointerEvents: 'none'
    };

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
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Enter your credentials to sign in</p>
                </div>

                <div className="card" style={{ padding: '32px', borderRadius: '20px', boxShadow: '0 16px 40px rgba(0,0,0,0.1)' }}>

                    {error && (
                        <div className="alert alert-error">
                            <HiOutlineExclamationCircle style={{ flexShrink: 0 }} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Email */}
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <HiOutlineMail style={iconStyle} />
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    style={{ paddingLeft: '40px' }}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="form-group" style={{ marginBottom: '28px' }}>
                            <label className="form-label">Password</label>
                            <div style={{ position: 'relative' }}>
                                <HiOutlineLockClosed style={iconStyle} />
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    style={{ paddingLeft: '40px' }}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                            style={{
                                width: '100%', padding: '14px',
                                borderRadius: '12px', fontWeight: '700',
                                fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                            }}
                        >
                            {loading ? (
                                <><span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> Signing in...</>
                            ) : 'Sign In'}
                        </button>
                    </form>

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
