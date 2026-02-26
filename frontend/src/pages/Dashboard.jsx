import { Link } from 'react-router-dom';
import { getUser } from '../services/auth';
import {
    HiOutlineShoppingBag, HiOutlineCalendar, HiOutlinePlusCircle,
    HiOutlineCurrencyRupee, HiOutlineShieldCheck, HiOutlineChartBar,
    HiOutlineSpeakerphone, HiOutlineCollection
} from 'react-icons/hi';

const actions = {
    Admin: [
        { to: '/admin', icon: HiOutlineShieldCheck, label: 'Approve Agents', desc: 'Verify and manage agent accounts.', bg: '#eff6ff', color: '#2563eb' },
        { to: '/all-bookings', icon: HiOutlineCollection, label: 'All Bookings', desc: 'Monitor every service request across community.', bg: '#fdf2f8', color: '#db2777' },
        { to: '/notices', icon: HiOutlineSpeakerphone, label: 'Post Notice', desc: 'Broadcast important updates to all users.', bg: '#fff7ed', color: '#ea580c' },
    ],
    Agent: [
        { to: '/services', icon: HiOutlinePlusCircle, label: 'Add Service', desc: 'List your professional services.', bg: '#ecfdf5', color: '#059669' },
        { to: '/agent/marketplace', icon: HiOutlineShoppingBag, label: 'My Marketplace', desc: 'Manage items for sale in local marketplace.', bg: '#fef2f2', color: '#dc2626' },
        { to: '/prices', icon: HiOutlineCurrencyRupee, label: 'Update Prices', desc: 'Manage rates for your services & products.', bg: '#f0f9ff', color: '#0ea5e9' },
        { to: '/my-listings', icon: HiOutlineCollection, label: 'My Listings', desc: 'View and manage your active listings.', bg: '#fef9f0', color: '#d97706' },
        { to: '/earnings', icon: HiOutlineChartBar, label: 'Earnings', desc: 'Track revenue and completed jobs.', bg: '#f5f3ff', color: '#7c3aed' },
    ],
    User: [
        { to: '/services', icon: HiOutlineCalendar, label: 'Browse Services', desc: 'Find and book local experts near you.', bg: '#eff6ff', color: '#2563eb' },
        { to: '/bookings', icon: HiOutlineCollection, label: 'My Bookings', desc: 'View and track all your appointments.', bg: '#ecfdf5', color: '#059669' },
        { to: '/prices', icon: HiOutlineCurrencyRupee, label: 'Market Price', desc: 'Check and update live market rates.', bg: '#f0f9ff', color: '#0ea5e9' },
    ],
};

const Dashboard = () => {
    const user = getUser();
    if (!user) return null;

    const cards = actions[user.role] || actions.User;

    return (
        <div className="page-wrapper">
            {/* Hero header */}
            <header style={{ marginBottom: '40px', paddingBottom: '28px', borderBottom: '1px solid var(--border-color)' }}>
                <div className="section-eyebrow">Dashboard Overview</div>
                <h1 className="section-title">Hey, {user.name}! 👋</h1>
                <p className="section-sub">
                    Welcome back to your <strong>{user.role}</strong> dashboard.
                </p>
            </header>

            <h2 style={{ marginBottom: '20px', fontSize: '1.2rem', fontWeight: '800' }}>Quick Actions</h2>
            <div className="dash-grid">
                {cards.map(({ to, icon: Icon, label, desc, bg, color }) => (
                    <Link
                        key={to}
                        to={to}
                        className="dash-card"
                    >
                        <div className="dash-card-icon" style={{ backgroundColor: bg, color }}>
                            <Icon />
                        </div>
                        <div>
                            <h3>{label}</h3>
                            <p>{desc}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
