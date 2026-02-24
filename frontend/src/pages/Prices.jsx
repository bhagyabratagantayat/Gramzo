import { useState, useEffect } from 'react';
import api from '../services/api';

const Prices = () => {
    const [prices, setPrices] = useState([]);
    const [filteredPrices, setFilteredPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const response = await api.get('/prices');
                setPrices(response.data.data);
                setFilteredPrices(response.data.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch prices. Please try again later.');
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

    // Calculate averages per item
    const averagePrices = prices.reduce((acc, current) => {
        if (!acc[current.item]) {
            acc[current.item] = { total: 0, count: 0 };
        }
        acc[current.item].total += current.price;
        acc[current.item].count += 1;
        return acc;
    }, {});

    const getAverage = (item) => {
        const data = averagePrices[item];
        return data ? (data.total / data.count).toFixed(2) : 0;
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading prices...</div>;
    if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Market Prices</h1>
                <input
                    type="text"
                    placeholder="Search item or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: '10px',
                        width: '300px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        fontSize: '16px'
                    }}
                />
            </div>

            {/* Averages Summary */}
            <div style={{ marginBottom: '30px', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
                <h3>Average Prices Summary</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    {Object.keys(averagePrices).map(item => (
                        <div key={item} style={{ backgroundColor: '#fff', padding: '10px 15px', borderRadius: '5px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <strong>{item}:</strong> <span style={{ color: '#007bff' }}>₹{getAverage(item)}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {filteredPrices.map((price) => (
                    <div key={price._id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'relative' }}>
                        <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{price.item}</h3>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745', margin: '10px 0' }}>₹{price.price}</p>
                        <p><strong>Location:</strong> {price.location}</p>
                        <p><strong>Reported by:</strong> {price.agent?.name || 'Anonymous'}</p>
                        <div style={{
                            marginTop: '10px',
                            fontSize: '12px',
                            color: '#777',
                            borderTop: '1px solid #eee',
                            paddingTop: '10px'
                        }}>
                            Avg in market: ₹{getAverage(price.item)}
                        </div>
                    </div>
                ))}
                {filteredPrices.length === 0 && (
                    <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#777' }}>
                        No prices found matching "{searchTerm}"
                    </p>
                )}
            </div>
        </div>
    );
};

export default Prices;
