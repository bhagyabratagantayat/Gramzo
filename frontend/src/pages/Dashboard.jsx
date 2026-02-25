import { Link } from 'react-router-dom';
import { getUser } from '../services/auth';
import {
    HiOutlineShoppingBag,
    HiOutlineCalendar,
    HiOutlinePlusCircle,
    HiOutlineCurrencyRupee,
    HiOutlineShieldCheck,
    HiOutlineChartBar,
    HiOutlineSpeakerphone,
    HiOutlineCollection
} from 'react-icons/hi';

const Dashboard = () => {
    const user = getUser();

    if (!user) return null;

    const containerStyle = {
        padding: '60px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
    };

    const cardStyle = {
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '16px',
        padding: '32px',
        borderRadius: '24px',
        height: '100%'
    };

    const iconBoxStyle = {
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.8rem',
        marginBottom: '4px'
    };

    const renderActions = () => {
        switch (user.role) {
            case 'Admin':
                return (
                    <>
                        <Link to="/admin" className="card hover-lift" style={cardStyle}>
                            <div style={{ ...iconBoxStyle, backgroundColor: '#eff6ff', color: '#2563eb' }}>
                                <HiOutlineShieldCheck />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Approve Agents</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>Verify and manage agent accounts on the platform.</p>
                        </Link>
                        <Link to="/all-bookings" className="card hover-lift" style={cardStyle}>
                            <div style={{ ...iconBoxStyle, backgroundColor: '#fdf2f8', color: '#db2777' }}>
                                <HiOutlineCollection />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>View All Bookings</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>Monitor all service requests across the community.</p>
                        </Link>
                        <Link to="/notices" className="card hover-lift" style={cardStyle}>
                            <div style={{ ...iconBoxStyle, backgroundColor: '#fff7ed', color: '#ea580c' }}>
                                <HiOutlineSpeakerphone />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Add Notice</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>Broadcast important updates to all platform users.</p>
                        </Link>
                    </>
                );
            case 'Agent':
                return (
                    <>
                        <Link to="/services" className="card hover-lift" style={cardStyle}>
                            <div style={{ ...iconBoxStyle, backgroundColor: '#ecfdf5', color: '#059669' }}>
                                <HiOutlinePlusCircle />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Add Service</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>List your professional services for the community.</p>
                        </Link>
                        <Link to="/marketplace" className="card hover-lift" style={cardStyle}>
                            <div style={{ ...iconBoxStyle, backgroundColor: '#fef2f2', color: '#dc2626' }}>
                                <HiOutlineShoppingBag />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Add Product</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>Post items for sale in the local marketplace.</p>
                        </Link>
                        <Link to="/prices" className="card hover-lift" style={cardStyle}>
                            <div style={{ ...iconBoxStyle, backgroundColor: '#f0f9ff', color: '#0ea5e9' }}>
                                <HiOutlineCurrencyRupee />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Update Price</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>Manage rates for your listed services and products.</p>
                        </Link>
                        <Link to="/my-listings" className="card hover-lift" style={cardStyle}>
                            <div style={{ ...iconBoxStyle, backgroundColor: '#fef2f2', color: '#ef4444' }}>
                                <HiOutlineCollection />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>My Listings</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>View and manage your active services and products.</p>
                        </Link>
                        <Link to="/earnings" className="card hover-lift" style={cardStyle}>
                            <div style={{ ...iconBoxStyle, backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
                                <HiOutlineChartBar />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>View Earnings</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>Track your revenue and completed appointments.</p>
                        </Link>
                    </>
                );
            default: // User
                return (
                    <>
                        <Link to="/services" className="card hover-lift" style={cardStyle}>
                            <div style={{ ...iconBoxStyle, backgroundColor: '#eff6ff', color: '#2563eb' }}>
                                <HiOutlineCalendar />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Browse Services</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>Find and book local experts for your home needs.</p>
                        </Link>
                        <Link to="/bookings" className="card hover-lift" style={cardStyle}>
                            <div style={{ ...iconBoxStyle, backgroundColor: '#ecfdf5', color: '#059669' }}>
                                <HiOutlineCollection />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>My Bookings</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>View and track all your service appointments.</p>
                        </Link>
                    </>
                );
        }
    };

    return (
        <div style={containerStyle}>
            <header style={{ marginBottom: '48px', borderBottom: '1px solid var(--border-color)', paddingBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)', fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                    Dashboard Overview
                </div>
                <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.025em' }}>Hey, {user.name}!</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '12px' }}>
                    Welcome back to your <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{user.role}</span> dashboard.
                </p>
            </header>

            <h2 style={{ marginBottom: '24px', fontSize: '1.5rem', fontWeight: '800' }}>Quick Actions</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '24px'
            }}>
                {renderActions()}
            </div>
        </div>
    );
};

export default Dashboard;
