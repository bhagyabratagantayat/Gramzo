const Footer = () => {
    return (
        <footer style={{
            padding: '30px 20px',
            backgroundColor: '#f8f9fa',
            color: '#666',
            textAlign: 'center',
            borderTop: '1px solid #eee',
            marginTop: '40px'
        }}>
            <div style={{ marginBottom: '10px' }}>
                <h2 style={{ color: '#333', margin: 0 }}>GRAMZO</h2>
                <p style={{ margin: '5px 0' }}>Connecting Communities, Empowing Individuals.</p>
            </div>
            <div style={{ fontSize: '14px' }}>
                &copy; {new Date().getFullYear()} Gramzo Platform | All Rights Reserved
            </div>
        </footer>
    );
};

export default Footer;
