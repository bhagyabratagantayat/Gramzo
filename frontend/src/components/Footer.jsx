const Footer = () => {
    return (
        <footer style={{
            padding: '40px 20px',
            backgroundColor: '#1a1a1a',
            color: '#fff',
            textAlign: 'center',
            marginTop: '60px',
            borderTop: '4px solid var(--primary-color)'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{ color: '#fff', marginBottom: '10px' }}>GRAMZO</h2>
                <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>© 2026 Gramzo Platform. All rights reserved.</p>
                <p style={{ opacity: 0.6, fontSize: '0.9rem', marginTop: '10px' }}>Empowering local economies through technology.</p>
            </div>
        </footer>
    );
};

export default Footer;
