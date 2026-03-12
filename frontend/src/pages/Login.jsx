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
                login(user, accessToken);

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

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-brand">
                    <div className="flex-center gap-2 mb-5">
                        <HiLightningBolt className="text-primary text-3xl" />
                        <span className="text-2xl font-black tracking-tighter">Gramzo</span>
                    </div>
                    <h1 className="text-3xl font-black mb-2 tracking-tight">Welcome back</h1>
                    <p className="text-muted">Enter your credentials to sign in</p>
                </div>

                <div className="auth-card">
                    {error && (
                        <div className="alert alert-error">
                            <HiOutlineExclamationCircle className="shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div className="relative">
                                <HiOutlineMail className="auth-input-icon" />
                                <input
                                    type="email"
                                    className="form-input pl-11"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group mb-7">
                            <label className="form-label">Password</label>
                            <div className="relative">
                                <HiOutlineLockClosed className="auth-input-icon" />
                                <input
                                    type="password"
                                    className="form-input pl-11"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary btn-full py-3.5 rounded-xl font-bold text-base flex-center gap-2"
                        >
                            {loading ? (
                                <><span className="spinner w-4 h-4 border-2" /> Signing in...</>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center mt-6 mb-0 text-muted text-sm">
                        New to Gramzo?{' '}
                        <Link to="/signup" className="text-primary font-bold">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
