import { Link } from 'react-router-dom';

const Navbar = () => {
    const navStyle = {
        padding: '10px 20px',
        backgroundColor: '#333',
        color: '#fff',
        display: 'flex',
        gap: '20px',
        alignItems: 'center'
    };

    const linkStyle = {
        color: '#fff',
        textDecoration: 'none',
        fontWeight: 'bold'
    };

    return (
        <nav style={navStyle}>
            <h2 style={{ margin: 0, marginRight: 'auto' }}>Gramzo</h2>
            <Link to="/" style={linkStyle}>Home</Link>
            <Link to="/prices" style={linkStyle}>Prices</Link>
            <Link to="/services" style={linkStyle}>Services</Link>
            <Link to="/marketplace" style={linkStyle}>Marketplace</Link>
            <Link to="/notices" style={linkStyle}>Notices</Link>
        </nav>
    );
};

export default Navbar;
