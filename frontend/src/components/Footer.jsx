import { Link } from 'react-router-dom';
import { HiLightningBolt } from 'react-icons/hi';

const Footer = () => {
    const links = [
        { label: 'Services', to: '/services' },
        { label: 'Marketplace', to: '/marketplace' },
        { label: 'Notices', to: '/notices' },
        { label: 'Sign In', to: '/login' }
    ];

    return (
        <footer style={{
            backgroundColor: '#0f172a',
            borderTop: '3px solid var(--primary-color)',
            padding: '48px 24px 32px',
            marginTop: '60px'
        }}>
            <div style={{
                maxWidth: '1200px', margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '40px',
                marginBottom: '40px'
            }}>
                {/* Brand */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                        <HiLightningBolt style={{ color: 'var(--primary-color)', fontSize: '1.6rem' }} />
                        <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.04em' }}>Gramzo</span>
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.65, margin: 0, maxWidth: '240px' }}>
                        Empowering local economies through technology. Connecting villages to the digital age.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
                        Quick Links
                    </div>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {links.map(l => (
                            <li key={l.to}>
                                <Link to={l.to} style={{
                                    color: '#94a3b8', fontSize: '0.92rem', fontWeight: '500',
                                    textDecoration: 'none', transition: 'var(--transition)'
                                }}
                                    onMouseEnter={e => e.target.style.color = '#fff'}
                                    onMouseLeave={e => e.target.style.color = '#94a3b8'}
                                >
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Tagline */}
                <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
                        Mission
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>
                        Built for Bharat. Connecting 500+ villages to trusted local services, community markets, and real-time information.
                    </p>
                </div>
            </div>

            {/* Bottom bar */}
            <div style={{
                borderTop: '1px solid #1e293b',
                paddingTop: '24px', textAlign: 'center',
                color: '#475569', fontSize: '0.83rem'
            }}>
                © 2026 Gramzo Platform. All rights reserved. · Made with ❤️ for rural India
            </div>
        </footer>
    );
};

export default Footer;
