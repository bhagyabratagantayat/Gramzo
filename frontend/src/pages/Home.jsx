import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <h1>Gramzo App Running</h1>
            <p>Welcome to Gramzo. Your community portal is active.</p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
            </div>
        </div>
    );
};

export default Home;
