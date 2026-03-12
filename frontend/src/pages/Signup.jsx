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
                const { user, accessToken } = res.data;
                signup(user, accessToken);

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

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-brand">
                    <div className="flex-center gap-2 mb-4">
                        <HiLightningBolt className="text-primary text-3xl" />
                        <span className="text-2xl font-black tracking-tighter">Gramzo</span>
                    </div>
                    <h1 className="text-3xl font-black mb-2 tracking-tight">Create your account</h1>
                    <p className="text-muted">Join thousands of community members on Gramzo</p>
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
                            <label className="form-label">Full Name</label>
                            <div className="relative">
                                <HiOutlineUser className="auth-input-icon" />
                                <input
                                    type="text"
                                    name="name"
                                    className="form-input pl-11"
                                    placeholder="Your Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div className="relative">
                                <HiOutlineMail className="auth-input-icon" />
                                <input
                                    type="email"
                                    name="email"
                                    className="form-input pl-11"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <div className="relative">
                                <HiOutlinePhone className="auth-input-icon" />
                                <input
                                    type="tel"
                                    name="phone"
                                    className="form-input pl-11"
                                    placeholder="10-digit mobile"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="relative">
                                <HiOutlineLockClosed className="auth-input-icon" />
                                <input
                                    type="password"
                                    name="password"
                                    className="form-input pl-11"
                                    placeholder="At least 6 characters"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Location (Optional)</label>
                            <div className="relative">
                                <HiOutlineLocationMarker className="auth-input-icon" />
                                <input
                                    type="text"
                                    name="location"
                                    className="form-input pl-11"
                                    placeholder="Village or city"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group mb-7">
                            <label className="form-label">Join As</label>
                            <div className="relative">
                                <HiOutlineUserGroup className="auth-input-icon" />
                                <select
                                    name="role"
                                    className="form-select pl-11"
                                    value={formData.role}
                                    onChange={handleChange}
                                >
                                    <option value="User">User — Book services</option>
                                    <option value="Agent">Agent Partner — Offer services</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary btn-full py-3.5 rounded-xl font-bold text-lg flex-center gap-2"
                        >
                            {loading ? (
                                <><span className="spinner w-4 h-4 border-2" /> Creating account...</>
                            ) : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center mt-6 mb-0 text-muted text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary font-bold">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
