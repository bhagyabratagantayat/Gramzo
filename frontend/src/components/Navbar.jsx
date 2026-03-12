import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HiLightningBolt, HiOutlineLogout, HiUserCircle,
    HiSearch, HiOutlineHome, HiOutlineCollection,
    HiOutlineCurrencyRupee, HiOutlineChartBar,
    HiOutlineShieldCheck, HiOutlineSpeakerphone,
    HiOutlinePlusCircle, HiOutlineShoppingBag,
    HiOutlineCalendar, HiOutlineX, HiOutlineBell,
    HiOutlineSearch
} from 'react-icons/hi';

const NAV_LINKS = {
    Admin: [
        { to: '/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
        { to: '/marketplace', icon: HiOutlineShoppingBag, label: 'Marketplace' },
        { to: '/prices', icon: HiOutlineCurrencyRupee, label: 'Market Price' },
        { to: '/admin', icon: HiOutlineShieldCheck, label: 'Manage' },
        { to: '/notifications', icon: HiOutlineSpeakerphone, label: 'Notifications' },
    ],
    User: [
        { to: '/', icon: HiOutlineHome, label: 'Home' },
        { to: '/marketplace', icon: HiOutlineShoppingBag, label: 'Marketplace' },
        { to: '/services', icon: HiOutlineCollection, label: 'Services' },
        { to: '/prices', icon: HiOutlineCurrencyRupee, label: 'Market Price' },
        { to: '/bookings', icon: HiOutlineCalendar, label: 'My Bookings' },
        { to: '/notifications', icon: HiOutlineSpeakerphone, label: 'Notifications' },
    ],
    Agent: [
        { to: '/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
        { to: '/agent/marketplace', icon: HiOutlineShoppingBag, label: 'My Marketplace' },
        { to: '/my-listings', icon: HiOutlineCollection, label: 'My Listings' },
        { to: '/prices', icon: HiOutlineCurrencyRupee, label: 'Market Price' },
        { to: '/earnings', icon: HiOutlineChartBar, label: 'Earnings' },
        { to: '/notifications', icon: HiOutlineSpeakerphone, label: 'Notifications' },
    ],
};

const ROLE_COLORS = {
    User: { bg: '#ecfdf5', color: '#059669' },
    Agent: { bg: '#eff6ff', color: '#2563eb' },
    Admin: { bg: '#fdf4ff', color: '#9333ea' },
};

import UserNavbar from './UserNavbar';
import AgentNavbar from './AgentNavbar';
import AdminNavbar from './AdminNavbar';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const isHomePage = location.pathname === '/';

    const [drawerOpen, setDrawerOpen] = useState(false);
    const drawerRef = useRef(null);

    // close drawer on route change
    useEffect(() => { setDrawerOpen(false); }, [location]);

    // close drawer on outside click
    useEffect(() => {
        const handler = (e) => {
            if (drawerRef.current && !drawerRef.current.contains(e.target)) setDrawerOpen(false);
        };
        if (drawerOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [drawerOpen]);

    // lock body scroll when drawer open
    useEffect(() => {
        document.body.style.overflow = drawerOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [drawerOpen]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const renderLinks = (isDrawer = false) => {
        const props = { onLinkClick: () => setDrawerOpen(false) };
        if (!user) return <UserNavbar {...props} />;

        switch (user.role) {
            case 'Admin': return <AdminNavbar {...props} />;
            case 'Agent': return <AgentNavbar {...props} />;
            default: return <UserNavbar {...props} />;
        }
    };

    const roleCfg = user ? (ROLE_COLORS[user.role] || ROLE_COLORS.User) : null;

    // Homepage Special Header
    if (isHomePage) {
        return (
            <header className="home-special-header">
                <div className="header-inner">
                    <div className="header-left">
                        {user ? (
                            <Link to="/dashboard" className="profile-trigger">
                                <HiUserCircle />
                            </Link>
                        ) : (
                            <Link to="/login" className="profile-trigger">
                                <HiUserCircle />
                            </Link>
                        )}
                    </div>
                    <div className="header-center">
                        <Link to="/" className="home-logo">Gramzo</Link>
                    </div>
                    <div className="header-right">
                        {user ? (
                            <Link to="/notifications" className="notification-icon">
                                <HiOutlineBell />
                            </Link>
                        ) : (
                            <Link to="/login" className="btn-signin-small">Login</Link>
                        )}
                    </div>
                </div>
            </header>
        );
    }

    // Other Pages Navbar
    return (
        <>
            <nav className="main-navbar">
                <div className="navbar-inner">
                    <div className="navbar-brand">
                        <button
                            className={`hamburger-btn${drawerOpen ? ' open' : ''}`}
                            onClick={() => setDrawerOpen(o => !o)}
                        >
                            <span /><span /><span />
                        </button>
                        <Link to="/" className="navbar-logo">
                            <HiLightningBolt className="logo-icon" />
                            <span>Gramzo</span>
                        </Link>
                    </div>

                    <ul className="navbar-nav-links">
                        {renderLinks()}
                    </ul>

                    <div className="navbar-actions">
                        {user ? (
                            <div className="user-profile-section">
                                <div className="user-info hide-mobile">
                                    <span className="user-name">{user.name.split(' ')[0]}</span>
                                    <span className="role-tag" style={{ backgroundColor: roleCfg.bg, color: roleCfg.color }}>
                                        {user.role}
                                    </span>
                                </div>
                                <button onClick={handleLogout} className="logout-btn" title="Logout">
                                    <HiOutlineLogout />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="login-btn-premium">Sign In</Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <div className={`nav-drawer${drawerOpen ? ' open' : ''}`} ref={drawerRef}>
                <div className="drawer-panel">
                    <div className="drawer-header">
                        <div className="drawer-logo">
                            <HiLightningBolt className="logo-icon" /> Gramzo
                        </div>
                        <button className="close-btn" onClick={() => setDrawerOpen(false)}>
                            <HiOutlineX />
                        </button>
                    </div>

                    <div className="drawer-body">
                        <ul className="drawer-links" style={{ listStyle: 'none', padding: 0 }}>
                            {renderLinks(true)}
                        </ul>

                        <div className="drawer-divider" />

                        {user ? (
                            <div className="drawer-footer">
                                <div className="drawer-user-info">
                                    <HiUserCircle className="user-avatar" />
                                    <div>
                                        <div className="name">{user.name}</div>
                                        <div className="role">{user.role}</div>
                                    </div>
                                </div>
                                <button onClick={handleLogout} className="drawer-logout-btn">
                                    <HiOutlineLogout /> Logout
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="drawer-login-btn" onClick={() => setDrawerOpen(false)}>
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
