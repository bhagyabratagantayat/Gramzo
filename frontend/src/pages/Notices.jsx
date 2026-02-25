import { useState, useEffect } from 'react';
import api from '../services/api';
import { demoNotices } from '../services/demoData';
import { HiOutlineSpeakerphone, HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineBell } from 'react-icons/hi';

const Notices = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await api.get('/notices');
                const data = response.data.data;
                setNotices(data.length > 0 ? data : demoNotices);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch notices');
                setNotices(demoNotices);
                setLoading(false);
            }
        };
        fetchNotices();
    }, []);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-muted)' }}>
            Fetching community updates...
        </div>
    );

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
            <header style={{ marginBottom: '48px' }}>
                <div style={{ color: 'var(--primary-color)', fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    Community Bulletin
                </div>
                <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <HiOutlineSpeakerphone /> Notice Board
                </h1>
            </header>

            <div style={{ display: 'grid', gap: '24px' }}>
                {notices.map((notice) => (
                    <div key={notice._id} className="card hover-lift" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', borderLeft: '6px solid var(--primary-color)' }}>
                        {notice.imageUrl && (
                            <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
                                <img src={notice.imageUrl} alt={notice.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        )}
                        <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800' }}>{notice.title}</h2>
                                    <span className="filter-chip">
                                        <HiOutlineLocationMarker style={{ verticalAlign: 'text-bottom' }} /> {notice.location}
                                    </span>
                                </div>
                                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1rem', lineHeight: '1.6' }}>{notice.description}</p>
                            </div>

                            <div style={{ textAlign: 'right', minWidth: '120px', paddingTop: '4px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem', justifyContent: 'flex-end', marginBottom: '4px' }}>
                                    <HiOutlineCalendar /> Posted on
                                </div>
                                <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-main)' }}>
                                    {new Date(notice.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {notices.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: '#fff', borderRadius: 'var(--radius)', border: '1px dashed var(--border-color)' }}>
                        <HiOutlineBell style={{ fontSize: '3.5rem', color: 'var(--text-muted)', marginBottom: '16px', opacity: 0.5 }} />
                        <h3 style={{ margin: 0 }}>No active notices</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Community updates and announcements will appear here when posted.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notices;
