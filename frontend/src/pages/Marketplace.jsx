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
        <div className="marketplace-container">
            {error && (
                <div className="alert alert-warning flex-center" style={{ marginTop: '20px' }}>
                    <span style={{ fontSize: '1.2rem' }}>⚠️</span> {error}
                </div>
            )}

            <header className="home-hero">
                <div className="app-container">
                    <div className="section-eyebrow" style={{ color: 'var(--accent-color)' }}>Local Trade</div>
                    <h1 className="hero-title">Gramzo Marketplace</h1>
                    <p className="hero-subtitle">Browse fresh produce and local goods from trusted community sellers.</p>

                    <div className="hero-search-container">
                        <div className="hero-search-wrapper">
                            <HiOutlineSearch className="search-icon-dim" />
                            <input
                                type="text"
                                placeholder="Search products, categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="hero-search-input"
                            />
                        </div>
                    </div>
                </div>
            </header>

            <div className="app-container py-8">
                {Object.keys(groupedProducts).length > 0 ? (
                    Object.keys(groupedProducts).map((category) => (
                        <div key={category} className="section-spacer">
                            <div className="home-section-title">
                                <h2 className="section-title-premium" style={{ color: 'var(--accent-dark)' }}>{category}</h2>
                            </div>
                            <div className="responsive-grid-4">
                                {groupedProducts[category].map((product) => (
                                    <div key={product._id} className="standard-card hover-lift card-premium">
                                        <div className="card-image-wrapper">
                                            <img
                                                src={product.image || getFallbackImage(product.title, product.category)}
                                                alt={product.title}
                                                loading="lazy"
                                                onError={(e) => { e.target.src = getFallbackImage(product.title, product.category); }}
                                            />
                                            <div className="card-badge-top badge glass-morphism">
                                                {product.location || 'Local'}
                                            </div>
                                        </div>
                                        <div className="card-content">
                                            <h4 className="card-title-small">{product.title}</h4>
                                            <p className="card-desc-short">{product.description?.substring(0, 50)}...</p>
                                            
                                            <div className="flex-between mt-auto">
                                                <div className="text-price-mid">₹{product.price}</div>
                                                <div className="text-seller">
                                                    <HiOutlineTag /> {product.sellerName?.split(' ')[0]}
                                                </div>
                                            </div>

                                            {user ? (
                                                <button 
                                                    onClick={() => navigate(`/product/${product._id}`)}
                                                    className="btn-primary btn-full mt-4"
                                                    style={{ backgroundColor: 'var(--accent-color)' }}
                                                >
                                                    Contact Seller
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => navigate('/login')}
                                                    className="btn-secondary btn-full mt-4"
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
                    <div className="empty-state">
                        <HiOutlineShoppingBag className="empty-state-icon" />
                        <h3>No products found</h3>
                        <p>Try adjusting your search to find what you're looking for.</p>
                        <button onClick={() => setSearchQuery('')} className="btn-link-center">Clear Search</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Marketplace;
