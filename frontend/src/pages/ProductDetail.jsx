import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { HiOutlineArrowLeft, HiOutlineShoppingBag, HiOutlineLocationMarker, HiOutlineTag, HiOutlinePhone } from 'react-icons/hi';
import { getFallbackImage } from '../utils/imageHelper';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}`);
                setProduct(response.data.data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch product details', err);
                setError('Product not found or connection error.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: '16px' }}>
            <div className="spinner"></div>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Loading product details...</span>
        </div>
    );

    if (error || !product) return (
        <div style={{ maxWidth: '600px', margin: '100px auto', textAlign: 'center', padding: '40px', backgroundColor: '#fff', borderRadius: '20px', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🛰️</div>
            <h2 style={{ marginBottom: '12px' }}>{error || 'Product Not Found'}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>This item might have been removed or the link is broken.</p>
            <button onClick={() => navigate('/marketplace')} className="btn-primary">Back to Marketplace</button>
        </div>
    );

    return (
        <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
            <button
                onClick={() => navigate(-1)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', color: 'var(--text-muted)', fontWeight: 700, cursor: 'pointer', marginBottom: '32px', fontSize: '1rem' }}
                onMouseEnter={e => e.target.style.color = 'var(--primary-color)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >
                <HiOutlineArrowLeft /> Back
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }} className="grid-2-desktop">
                {/* Image Section */}
                <div className="card-premium" style={{ borderRadius: '24px', overflow: 'hidden', backgroundColor: '#fff', position: 'relative' }}>
                    <img
                        src={product.image || getFallbackImage(product.title, product.category?.name)}
                        alt={product.title}
                        style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover', display: 'block' }}
                        onError={(e) => { e.target.src = getFallbackImage(product.title, product.category?.name); }}
                    />
                    <div style={{ position: 'absolute', top: '20px', left: '20px' }} className="badge glass-morphism">
                        {product.category?.name || 'Local Marketplace'}
                    </div>
                </div>

                {/* Info Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div>
                        <div style={{ color: 'var(--primary-color)', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                            Fresh from Village
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: '0', letterSpacing: '-0.02em', color: '#111827' }}>{product.title}</h1>
                    </div>

                    <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary-color)' }}>
                        ₹{product.price}
                    </div>

                    <div className="card-premium" style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '16px' }}>
                        <h3 style={{ margin: '0 0 12px', fontSize: '1.1rem', fontWeight: 800 }}>Description</h3>
                        <p style={{ color: '#4b5563', lineHeight: '1.7', margin: 0 }}>
                            {product.description || "No detailed description provided for this item. Contact the seller for more information about quality and availability."}
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', backgroundColor: '#f3f4f6', borderRadius: '12px', color: '#374151', fontSize: '0.9rem', fontWeight: 700 }}>
                            <HiOutlineLocationMarker style={{ color: 'var(--primary-color)' }} /> {product.location || 'Local area'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', backgroundColor: '#f3f4f6', borderRadius: '12px', color: '#374151', fontSize: '0.9rem', fontWeight: 700 }}>
                            <HiOutlineTag style={{ color: 'var(--primary-color)' }} /> {product.sellerName || 'Verified Seller'}
                        </div>
                    </div>

                    <div style={{ marginTop: 'auto', pt: '20px' }}>
                        {isAuthenticated ? (
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <button className="btn-primary" style={{ flex: 1, padding: '18px 32px', fontSize: '1.1rem', justifyContent: 'center' }}>
                                    <HiOutlineShoppingBag /> Contact Seller
                                </button>
                                <a href={`tel:${product.phone || ''}`} className="btn-secondary" style={{ padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <HiOutlinePhone style={{ fontSize: '1.4rem' }} />
                                </a>
                            </div>
                        ) : (
                            <div className="card-premium" style={{ padding: '24px', backgroundColor: '#eff6ff', textAlign: 'center', border: '1px solid #dbeafe' }}>
                                <p style={{ margin: '0 0 16px', fontWeight: 700, color: '#1e40af' }}>Login to contact the seller and buy this product.</p>
                                <button onClick={() => navigate('/login')} className="btn-primary" style={{ margin: '0 auto' }}>Login Now</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CSS for grid layout on desktop */}
            <style>{`
                @media (min-width: 1024px) {
                    .grid-2-desktop {
                        grid-template-columns: 1fr 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProductDetail;
