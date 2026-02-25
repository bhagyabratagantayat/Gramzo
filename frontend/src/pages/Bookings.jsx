import React from 'react';

const Bookings = () => {
    return (
        <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '12px' }}>My Bookings</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Manage and track your service appointments here.</p>
            <div className="card" style={{ marginTop: '32px', textAlign: 'center', padding: '100px 40px' }}>
                <h3 style={{ color: 'var(--text-muted)' }}>You have no active bookings at the moment.</h3>
            </div>
        </div>
    );
};

export default Bookings;
