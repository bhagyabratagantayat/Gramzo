import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { demoProducts } from '../services/demoData';
import { useAuth } from '../context/AuthContext';
import { HiOutlineTag, HiOutlineLocationMarker, HiOutlinePhone, HiOutlineShoppingBag, HiOutlineSearch } from 'react-icons/hi';
import { getFallbackImage } from '../utils/imageHelper';

const Marketplace = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const search = params.get('search');
        if (search) setSearchQuery(search);
    }, [location.search]);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            const data = response.data.data;
            setProducts(data.length > 0 ? data : demoProducts);
            setError(null);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch products');
            setProducts(demoProducts); // Fallback to demo data
            setError('Could not connect to marketplace. Showing offline products.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter(p =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [products, searchQuery]);

    const groupedProducts = useMemo(() => {
        return filteredProducts.reduce((acc, product) => {
            const catName = product.category?.name || 'Uncategorized';
            if (!acc[catName]) acc[catName] = [];
            acc[catName].push(product);
            return acc;
        }, {});
    }, [filteredProducts]);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-muted)' }}>
            Opening the marketplace...
        </div>
    );

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
            {error && (
                <div style={{ backgroundColor: '#fff7ed', border: '1px solid #ffedd5', color: '#9a3412', padding: '12px 20px', borderRadius: '12px', marginBottom: '24px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.2rem' }}>⚠️</span> {error}
                </div>
            )}
            <header style={{ marginBottom: '48px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap', marginBottom: '32px' }}>
                    <div>
                        <div style={{ color: '#ea580c', fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                            Local Trade
                        </div>
                        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800' }}>Gramzo Marketplace</h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Browse fresh produce and local goods from trusted community sellers.</p>
                    </div>
                </div>

                <div style={{ position: 'relative', maxWidth: '600px' }}>
                    <HiOutlineSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '1.2rem' }} />
                    <input
                        type="text"
                        placeholder="Search products, categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '14px 20px 14px 48px',
                            borderRadius: '12px',
                            border: '1.5px solid var(--border-color)',
                            outline: 'none',
                            fontSize: '1rem',
                            fontFamily: 'inherit'
                        }}
                    />
                </div>
            </header>

            {Object.keys(groupedProducts).length > 0 ? (
                Object.keys(groupedProducts).map((category) => (
                    <div key={category} className="section-spacer">
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: '800',
                            color: '#9a3412',
                            marginBottom: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            {category}
                            <span style={{
                                height: '2px',
                                flex: 1,
                                background: 'linear-gradient(90deg, #ffedd5 0%, transparent 100%)'
                            }}></span>
                        </h2>
                        <div className="responsive-grid">
                            {groupedProducts[category].map((product) => (
                                <div key={product._id} className="service-card">
                                    <div className="service-card-img" style={{ height: '180px' }}>
                                        <img
                                            src={product.image || getFallbackImage(product.title, product.category)}
                                            alt={product.title}
                                            onError={(e) => { e.target.src = getFallbackImage(product.title, product.category); }}
                                        />
                                        <div className="service-card-badge">
                                            {product.location}
                                        </div>
                                    </div>
                                    <div className="service-card-body">
                                        <h3 className="service-card-title">{product.title}</h3>
                                        <p className="service-card-desc">{product.description}</p>
                                        <div style={{ marginTop: 'auto' }}>
                                            <div className="service-card-price">₹{product.price}</div>
                                        </div>
                                        {user ? (
                                            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#ea580c', fontWeight: '700' }}>
                                                    <HiOutlineTag /> {product.sellerName}
                                                </div>
                                                <button className="btn-primary" style={{ backgroundColor: '#ea580c', width: '100%', padding: '10px' }}>
                                                    Contact Seller
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => navigate('/login')}
                                                className="btn-primary"
                                                style={{ backgroundColor: '#ea580c', width: '100%', marginTop: '12px' }}
                                            >
                                                Login to Buy
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: '#fff', borderRadius: 'var(--radius)', border: '1px dashed var(--border-color)' }}>
                    <HiOutlineShoppingBag style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '16px' }} />
                    <h3 style={{ margin: 0 }}>No products found</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Try adjusting your search to find what you're looking for.</p>
                </div>
            )}
        </div>
    );
};

export default Marketplace;
