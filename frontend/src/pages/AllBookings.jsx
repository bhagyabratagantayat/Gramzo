import React from 'react';

const AllBookings = () => {
    return (
        <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '12px' }}>All Platform Bookings</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Full overview of all service requests across the platform.</p>
            <div className="card" style={{ marginTop: '32px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                            <th style={{ padding: '16px' }}>Booking ID</th>
                            <th style={{ padding: '16px' }}>User</th>
                            <th style={{ padding: '16px' }}>Agent</th>
                            <th style={{ padding: '16px' }}>Status</th>
                            <th style={{ padding: '16px' }}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No bookings found.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllBookings;
