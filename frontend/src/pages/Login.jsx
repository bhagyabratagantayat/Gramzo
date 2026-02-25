import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineUser, HiOutlinePhone } from 'react-icons/hi';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        phone: '',
        name: '',
        role: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (role) => {
        if (!formData.name || !formData.phone) {
            alert('Please fill in all fields');
            return;
        }

        let userData = { ...formData, role };

        // Requirement: If Agent, we need a valid agentId from the backend
        if (role === 'Agent') {
            try {
                const response = await fetch('http://localhost:5000/api/agents/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name,
                        phone: formData.phone,
                        location: 'Default' // Placeholder or from state if available
                    })
                });
                const result = await response.json();
                if (result.success) {
                    userData.agentId = result.data._id;
                } else {
                    alert('Agent verification failed: ' + result.error);
                    return;
                }
            } catch (err) {
                console.error('Failed to register/fetch agent:', err);
                alert('Connection error. Please try again.');
                return;
            }
        }

        // Requirement: Set role in state and save in localStorage
        setFormData(userData);
        localStorage.setItem('gramzoUser', JSON.stringify(userData));

        // Requirement: Redirect to /dashboard
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
        padding: '14px 14px 14px 42px',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        boxSizing: 'border-box',
        fontSize: '1rem',
        backgroundColor: '#fff',
        transition: 'var(--transition)',
        outline: 'none',
        boxShadow: 'var(--shadow-sm)'
    };

    const btnContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginTop: '32px'
    };

    const roleBtnStyle = (color) => ({
        width: '100%',
        padding: '16px',
        fontSize: '1rem',
        fontWeight: '700',
        borderRadius: '12px',
        border: 'none',
        color: '#fff',
        backgroundColor: color,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px'
    });

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'calc(100vh - 80px)',
            backgroundColor: 'var(--bg-color)',
            padding: '20px'
        }}>
            <div className="card" style={{
                width: '100%',
                maxWidth: '400px',
                padding: '40px',
                borderRadius: '24px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '12px', fontWeight: '900', letterSpacing: '-0.025em', color: 'var(--text-main)' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Enter your details to sign in</p>
                </div>

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

                <div style={btnContainerStyle}>
                    <button
                        onClick={() => handleLogin('User')}
                        style={roleBtnStyle('var(--primary-color)')}
                        className="hover-lift"
                    >
                        Login as User
                    </button>
                    <button
                        onClick={() => handleLogin('Agent')}
                        style={roleBtnStyle('var(--success-color)')}
                        className="hover-lift"
                    >
                        Login as Agent
                    </button>
                    <button
                        onClick={() => handleLogin('Admin')}
                        style={roleBtnStyle('var(--text-main)')}
                        className="hover-lift"
                    >
                        Login as Admin
                    </button>
                </div>

                <p style={{ textAlign: 'center', marginTop: '32px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    Don't have an account? <Link to="/signup" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '700' }}>Join Gramzo</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
