import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { getUser, logout } from '../services/auth';
import {
    HiLightningBolt, HiOutlineLogout, HiUserCircle,
    HiSearch, HiOutlineHome, HiOutlineCollection,
    HiOutlineCurrencyRupee, HiOutlineChartBar,
    HiOutlineShieldCheck, HiOutlineSpeakerphone,
    HiOutlinePlusCircle, HiOutlineShoppingBag,
    HiOutlineCalendar, HiOutlineX
} from 'react-icons/hi';

const NAV_LINKS = {
    User: [
        { to: '/', icon: HiOutlineHome, label: 'Home' },
        { to: '/marketplace', icon: HiOutlineShoppingBag, label: 'Marketplace' },
        { to: '/services', icon: HiOutlineCollection, label: 'Services' },
        { to: '/prices', icon: HiOutlineCurrencyRupee, label: 'Market Price' },
        { to: '/bookings', icon: HiOutlineCalendar, label: 'My Bookings' },
    ],
    Agent: [
        { to: '/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
        { to: '/agent/marketplace', icon: HiOutlineShoppingBag, label: 'My Marketplace' },
        { to: '/my-listings', icon: HiOutlineCollection, label: 'My Listings' },
        { to: '/prices', icon: HiOutlineCurrencyRupee, label: 'Market Price' },
        { to: '/earnings', icon: HiOutlineChartBar, label: 'Earnings' },
    ],
    Admin: [
        { to: '/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
        { to: '/marketplace', icon: HiOutlineShoppingBag, label: 'Marketplace' },
        { to: '/prices', icon: HiOutlineCurrencyRupee, label: 'Market Price' },
        { to: '/admin', icon: HiOutlineShieldCheck, label: 'Manage' },
        { to: '/all-bookings', icon: HiOutlineCollection, label: 'Bookings' },
        { to: '/notices', icon: HiOutlineSpeakerphone, label: 'Notices' },
    ],
};

const ROLE_COLORS = {
    User: { bg: '#ecfdf5', color: '#059669' },
    Agent: { bg: '#eff6ff', color: '#2563eb' },
    Admin: { bg: '#fdf4ff', color: '#9333ea' },
};

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = getUser();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
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

    const handleLogout = () => { logout(); navigate('/login'); };

    const links = user ? (NAV_LINKS[user.role] || []) : [];
    const roleCfg = user ? (ROLE_COLORS[user.role] || ROLE_COLORS.User) : null;

    const isActive = (to) => {
        if (to === '/') return location.pathname === '/';
        return location.pathname.startsWith(to);
    };

    if (location.pathname === '/') return null;

    return (
        <>
            <nav className="navbar">
                <div className="navbar-inner">
                    {/* Hamburger — mobile only */}
                    <button
                        className={`hamburger-btn${drawerOpen ? ' open' : ''}`}
                        onClick={() => setDrawerOpen(o => !o)}
                        aria-label="Toggle menu"
                    >
                        <span /><span /><span />
                    </button>

                    {/* Logo */}
                    <Link to="/" className="navbar-logo">
                        <HiLightningBolt style={{ color: 'var(--primary-color)', fontSize: '1.6rem' }} />
                        <span>Gramzo</span>
                    </Link>

                    {/* Search bar (hidden on mobile via CSS) */}
                    <div className="navbar-search">
                        <input
                            type="text"
                            placeholder="Search services, agents…"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && searchQuery.trim()) navigate(`/services?q=${encodeURIComponent(searchQuery.trim())}`); }}
                        />
                        <HiSearch className="navbar-search-icon" />
                    </div>

                    {/* Desktop nav links */}
                    <ul className="navbar-links">
                        {links.map(({ to, icon: Icon, label }) => (
                            <li key={to}>
                                <NavLink
                                    to={to}
                                    className={({ isActive: a }) => `navbar-link${a ? ' active' : ''}`}
                                    end={to === '/'}
                                >
                                    <Icon style={{ fontSize: '1rem', flexShrink: 0 }} />
                                    {label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    {/* Right section */}
                    <div className="navbar-right">
                        {user ? (
                            <>
                                {/* Role badge */}
                                <span className="navbar-role-badge" style={{ backgroundColor: roleCfg.bg, color: roleCfg.color }}>
                                    {user.role}
                                </span>
                                {/* User name */}
                                <span className="navbar-user-name">
                                    <HiUserCircle style={{ fontSize: '1.2rem', color: 'var(--text-muted)', verticalAlign: 'middle', marginRight: '4px' }} />
                                    {user.name}
                                </span>
                                <button onClick={handleLogout} className="navbar-logout-btn" title="Logout">
                                    <HiOutlineLogout />
                                    <span className="hide-mobile">Logout</span>
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="btn-primary" style={{ padding: '8px 18px', fontSize: '.9rem' }}>
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Slide-out Drawer (mobile) */}
            <div className={`nav-drawer${drawerOpen ? ' open' : ''}`} ref={drawerRef} onClick={e => { if (e.target === e.currentTarget) setDrawerOpen(false); }}>
                <div className="nav-drawer-panel">
                    {/* Drawer header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 900, fontSize: '1.2rem' }}>
                            <HiLightningBolt style={{ color: 'var(--primary-color)' }} /> Gramzo
                        </div>
                        <button onClick={() => setDrawerOpen(false)} style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '6px', display: 'flex', cursor: 'pointer' }}>
                            <HiOutlineX />
                        </button>
                    </div>

                    {/* Search bar inside drawer */}
                    <div style={{ position: 'relative', marginBottom: '12px' }}>
                        <input
                            type="text"
                            placeholder="Search services…"
                            style={{ width: '100%', height: '38px', padding: '0 36px 0 14px', border: '1.5px solid var(--border-color)', borderRadius: '999px', fontSize: '.9rem', fontFamily: 'inherit', outline: 'none', background: 'var(--bg-subtle)' }}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && searchQuery.trim()) { setDrawerOpen(false); navigate(`/services?q=${encodeURIComponent(searchQuery.trim())}`); } }}
                        />
                        <HiSearch style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    </div>

                    <div className="drawer-divider" />

                    {user && (
                        <>
                            <div className="drawer-section-label">Navigate</div>
                            {links.map(({ to, icon: Icon, label }) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    end={to === '/'}
                                    className={({ isActive: a }) => `drawer-link${a ? ' active' : ''}`}
                                >
                                    <Icon style={{ fontSize: '1.1rem', flexShrink: 0 }} />
                                    {label}
                                </NavLink>
                            ))}
                            <div className="drawer-divider" />
                            <div className="drawer-section-label">Account</div>
                            <div style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <HiUserCircle style={{ fontSize: '1.4rem', color: 'var(--text-muted)' }} />
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '.9rem' }}>{user.name}</div>
                                    <span style={{ display: 'inline-block', padding: '1px 8px', borderRadius: '999px', fontSize: '.68rem', fontWeight: 800, backgroundColor: roleCfg.bg, color: roleCfg.color, marginTop: '2px' }}>{user.role}</span>
                                </div>
                            </div>
                            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '11px 14px', background: 'var(--danger-light)', border: '1px solid #fca5a5', borderRadius: 'var(--radius)', color: 'var(--danger-color)', fontWeight: 700, fontSize: '.9rem', cursor: 'pointer', marginTop: '4px' }}>
                                <HiOutlineLogout /> Logout
                            </button>
                        </>
                    )}

                    {!user && (
                        <Link to="/login" className="btn-primary btn-full" onClick={() => setDrawerOpen(false)}>
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;
