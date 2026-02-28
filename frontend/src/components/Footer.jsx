import { Link } from 'react-router-dom';
import { HiLightningBolt } from 'react-icons/hi';

const Footer = () => {
    return (
        <footer className="main-footer">
            <div className="footer-grid">
                <div className="footer-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <HiLightningBolt style={{ color: 'var(--primary-color)', fontSize: '1.6rem' }} />
                        <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.04em' }}>Gramzo</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '300px' }}>
                        Empowering local communities by bridging the gap between neighborhood services and community members through technology.
                    </p>
                </div>
                <div className="footer-links">
                    <h5>Quick Links</h5>
                    <ul>
                        <li><Link to="/services">Local Services</Link></li>
                        <li><Link to="/marketplace">Marketplace</Link></li>
                        <li><Link to="/prices">Market Intelligence</Link></li>
                        <li><Link to="/notifications">Notifications</Link></li>
                    </ul>
                </div>
                <div className="footer-links">
                    <h5>Platform</h5>
                    <ul>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/contact">Contact Support</Link></li>
                        <li><Link to="/terms">Terms of Service</Link></li>
                    </ul>
                </div>
                <div className="footer-links">
                    <h5>Account</h5>
                    <ul>
                        <li><Link to="/dashboard">My Dashboard</Link></li>
                        <li><Link to="/login">Sign In</Link></li>
                        <li><Link to="/signup">Register</Link></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Gramzo Technologies. All rights reserved. Built for Bharat.</p>
            </div>
        </footer>
    );
};

export default Footer;
