import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getUser, logout } from '../services/auth';
import { HiLightningBolt, HiOutlineLogout, HiUserCircle } from 'react-icons/hi';

const Navbar = () => {
    const navigate = useNavigate();
    const user = getUser();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const linkStyle = ({ isActive }) => ({
        color: isActive ? 'var(--primary-color)' : 'var(--text-main)',
        textDecoration: 'none',
        fontWeight: '600',
        fontSize: '0.95rem',
        padding: '8px 12px',
        borderRadius: '6px',
        transition: 'var(--transition)',
        backgroundColor: isActive ? '#eff6ff' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    });

    const renderLinks = () => {
        if (!user) return null;

        switch (user.role) {
            case 'User':
                return (
                    <>
                        <li><NavLink to="/" style={linkStyle}>Home</NavLink></li>
                        <li><NavLink to="/services" style={linkStyle}>Services</NavLink></li>
                        <li><NavLink to="/bookings" style={linkStyle}>My Bookings</NavLink></li>
                    </>
                );
            case 'Agent':
                return (
                    <>
                        <li><NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink></li>
                        <li><NavLink to="/my-listings" style={linkStyle}>My Listings</NavLink></li>
                        <li><NavLink to="/prices" style={linkStyle}>Prices</NavLink></li>
                        <li><NavLink to="/earnings" style={linkStyle}>Earnings</NavLink></li>
                    </>
                );
            case 'Admin':
                return (
                    <>
                        <li><NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink></li>
                        <li><NavLink to="/admin" style={linkStyle}>Manage Agents</NavLink></li>
                        <li><NavLink to="/all-bookings" style={linkStyle}>All Bookings</NavLink></li>
                        <li><NavLink to="/notices" style={linkStyle}>Notices</NavLink></li>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <nav style={{
            padding: '0.75rem 2rem',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            backdropFilter: 'blur(8px)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                <Link to="/" style={{
                    color: 'var(--text-main)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    letterSpacing: '-1px'
                }}>
                    <HiLightningBolt style={{ color: 'var(--primary-color)', fontSize: '1.8rem' }} />
                    Gramzo
                </Link>

                <ul style={{
                    listStyle: 'none',
                    display: 'flex',
                    gap: '8px',
                    margin: 0,
                    padding: 0,
                    alignItems: 'center'
                }}>
                    {renderLinks()}
                </ul>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '1px solid var(--border-color)', paddingLeft: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                            <HiUserCircle style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }} />
                            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user.name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                backgroundColor: 'transparent',
                                color: 'var(--danger-color)',
                                border: 'none',
                                padding: '8px',
                                borderRadius: '6px',
                                fontWeight: '600',
                                fontSize: '0.9rem'
                            }}
                            title="Logout"
                        >
                            <HiOutlineLogout style={{ fontSize: '1.2rem' }} />
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className="btn-primary">
                        Sign In
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
