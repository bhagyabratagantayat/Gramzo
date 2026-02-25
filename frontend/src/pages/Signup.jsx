import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineUser, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineUserGroup } from 'react-icons/hi';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        location: '',
        role: 'User'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('gramzoUser', JSON.stringify(formData));
        navigate('/dashboard');
    };

    const inputContainerStyle = {
        position: 'relative',
        marginBottom: '20px'
    };

    const iconStyle = {
        position: 'absolute',
        left: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--text-muted)',
        fontSize: '1.2rem'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 14px 12px 42px',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        boxSizing: 'border-box',
        fontSize: '1rem',
        backgroundColor: '#fff',
        transition: 'var(--transition)',
        outline: 'none'
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)', backgroundColor: 'var(--bg-color)', padding: '40px 20px' }}>
            <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '48px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '8px', fontWeight: '800' }}>Create account</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Join thousands of community members on Gramzo</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={inputContainerStyle}>
                        <HiOutlineUser style={iconStyle} />
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={inputContainerStyle}>
                        <HiOutlinePhone style={iconStyle} />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={inputContainerStyle}>
                        <HiOutlineLocationMarker style={iconStyle} />
                        <input
                            type="text"
                            name="location"
                            placeholder="Location (Village/City)"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={inputContainerStyle}>
                        <HiOutlineUserGroup style={iconStyle} />
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            style={{ ...inputStyle, appearance: 'none' }}
                        >
                            <option value="User">Join as a User</option>
                            <option value="Agent">Join as an Agent Partner</option>
                        </select>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', marginTop: '8px' }}>
                        Create Account
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '32px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '700' }}>Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
