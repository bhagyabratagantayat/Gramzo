import React from 'react';

const Earnings = () => {
    return (
        <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '12px' }}>Earnings Overview</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Track your revenue and transaction history.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginTop: '32px' }}>
                <div className="card">
                    <h4 style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Total Revenue</h4>
                    <h2 style={{ fontSize: '2rem', margin: 0 }}>₹0.00</h2>
                </div>
                <div className="card">
                    <h4 style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Pending Payouts</h4>
                    <h2 style={{ fontSize: '2rem', margin: 0 }}>₹0.00</h2>
                </div>
                <div className="card">
                    <h4 style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Completed Jobs</h4>
                    <h2 style={{ fontSize: '2rem', margin: 0 }}>0</h2>
                </div>
            </div>
        </div>
    );
};

export default Earnings;
