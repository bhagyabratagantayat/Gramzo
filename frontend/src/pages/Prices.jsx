import { useState, useEffect } from 'react';
import api from '../services/api';
import { isAgent } from '../services/auth';
import { demoPrices } from '../services/demoData';
import { HiOutlineSearch, HiOutlineTrendingUp, HiOutlineLocationMarker, HiOutlineUserCircle } from 'react-icons/hi';

const Prices = () => {
    const [prices, setPrices] = useState([]);
    const [filteredPrices, setFilteredPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const response = await api.get('/prices');
                const data = response.data.data;
                const finalPrices = data.length > 0 ? data : demoPrices;
                setPrices(finalPrices);
                setFilteredPrices(finalPrices);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch prices, using demo data as fallback.', err);
                setPrices(demoPrices);
                setFilteredPrices(demoPrices);
                setLoading(false);
            }
        };
        fetchPrices();
    }, []);

    useEffect(() => {
        const filtered = prices.filter(price =>
            price.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
            price.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPrices(filtered);
    }, [searchTerm, prices]);

    const averagePrices = prices.reduce((acc, current) => {
        if (!acc[current.item]) acc[current.item] = { total: 0, count: 0 };
        acc[current.item].total += current.price;
        acc[current.item].count += 1;
        return acc;
    }, {});

    const getAverage = (item) => {
        const data = averagePrices[item];
        return data ? (data.total / data.count).toFixed(0) : 0;
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-muted)' }}>
            Loading market insights...
        </div>
    );

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', gap: '24px', flexWrap: 'wrap' }}>
                <div>
                    <div style={{ color: 'var(--primary-color)', fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                        Real-time Market Data
                    </div>
                    <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800' }}>Commodity Prices</h1>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                        <HiOutlineSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search item or village..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '12px 14px 12px 38px',
                                width: '280px',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                fontSize: '0.95rem',
                                outline: 'none',
                                transition: 'var(--transition)'
                            }}
                        />
                    </div>
                    {isAgent() && (
                        <button className="btn-primary">
                            Update Rates
                        </button>
                    )}
                </div>
            </header>

            <section style={{ marginBottom: '48px', padding: '24px', backgroundColor: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HiOutlineTrendingUp style={{ color: 'var(--primary-color)' }} /> Average Market Rates
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {Object.keys(averagePrices).map(item => (
                        <div key={item} style={{ backgroundColor: 'var(--bg-color)', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem' }}>{item}</span>
                            <span style={{ color: 'var(--text-main)', fontWeight: '800', fontSize: '1.1rem' }}>₹{getAverage(item)}</span>
                        </div>
                    ))}
                </div>
            </section>

            <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
                {filteredPrices.map((price) => (
                    <div key={price._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>{price.item}</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', backgroundColor: 'var(--bg-color)', padding: '4px 10px', borderRadius: '20px' }}>
                                <HiOutlineLocationMarker /> {price.location}
                            </div>
                        </div>

                        <div style={{ margin: '8px 0' }}>
                            <div style={{ color: 'var(--success-color)', fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px' }}>
                                ₹{price.price}
                                <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '500', marginLeft: '4px' }}>/ unit</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
                            <HiOutlineUserCircle style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }} />
                            <div style={{ fontSize: '0.9rem' }}>
                                <div style={{ color: 'var(--text-muted)' }}>Verified Agent</div>
                                <div style={{ fontWeight: '700' }}>{price.agent?.name || 'Gramzo Partner'}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredPrices.length === 0 && (
                <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: '#fff', borderRadius: 'var(--radius)', border: '1px dashed var(--border-color)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔎</div>
                    <h3 style={{ margin: 0 }}>No results found</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>We couldn't find any prices matching "{searchTerm}". Try a different term.</p>
                </div>
            )}
        </div>
    );
};

export default Prices;
