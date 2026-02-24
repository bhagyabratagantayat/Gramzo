import { useState, useEffect } from 'react';
import api from '../services/api';

const Notices = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await api.get('/notices');
                // Notices are sorted latest first on the backend, but we can ensure it here too
                setNotices(response.data.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch notices. Please try again later.');
                setLoading(false);
            }
        };

        fetchNotices();
    }, []);

    if (loading) return <div style={{ padding: '20px' }}>Loading notices...</div>;
    if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Notice Board</h1>
            <div style={{ display: 'grid', gap: '20px' }}>
                {notices.map((notice) => (
                    <div key={notice._id} style={{ borderLeft: '5px solid #007bff', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '0 8px 8px 0', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ margin: '0 0 10px 0', color: '#007bff' }}>{notice.title}</h2>
                        <p style={{ color: '#333', lineHeight: '1.6' }}>{notice.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontSize: '14px', color: '#666' }}>
                            <span>📍 {notice.location}</span>
                            <span>📅 {new Date(notice.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
                {notices.length === 0 && <p style={{ padding: '40px', textAlign: 'center', color: '#777' }}>The notice board is currently empty.</p>}
            </div>
        </div>
    );
};

export default Notices;
