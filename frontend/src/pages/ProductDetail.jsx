import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
    HiOutlineArrowLeft,
    HiOutlineShoppingBag,
    HiOutlineLocationMarker,
    HiOutlineTag,
    HiOutlinePhone,
    HiOutlinePencilAlt,
    HiOutlineX,
    HiOutlineSave
} from 'react-icons/hi';
import { getFallbackImage } from '../utils/imageHelper';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [editForm, setEditForm] = useState({
        title: '',
        price: '',
        description: '',
        image: '',
        category: '',
        location: '',
        sellerName: '',
        phone: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            const data = response.data.data;
            setProduct(data);
            setEditForm({
                title: data.title || '',
                price: data.price || '',
                description: data.description || '',
                image: data.image || '',
                category: data.category?._id || data.category || '',
                location: data.location || '',
                sellerName: data.sellerName || '',
                phone: data.phone || ''
            });
            setError(null);
        } catch (err) {
            console.error('Failed to fetch product details', err);
            setError('Product not found or connection error.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();

        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                setCategories(res.data.data);
            } catch (err) {
                console.error('Failed to fetch categories');
            }
        };
        fetchCategories();
    }, [id]);

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!editForm.title || !editForm.price) {
            alert('Title and Price are required.');
            return;
        }
        if (isNaN(editForm.price)) {
            alert('Price must be a number.');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.put(`/products/${id}`, editForm);
            await fetchProduct(); // Refresh data
            setIsEditModalOpen(false);
            alert('Product updated successfully!');
        } catch (err) {
            console.error('Update failed', err);
            alert(err.response?.data?.error || 'Failed to update product');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Check if user is the owner (Agent) or Admin
    const isOwner = user && (user.role === 'Admin' || (user.role === 'Agent' && product?.agentId === user._id));

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', color: 'var(--text-muted)', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}
                    onMouseEnter={e => e.target.style.color = 'var(--primary-color)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >
                    <HiOutlineArrowLeft /> Back
                </button>

                {isOwner && (
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px' }}
                    >
                        <HiOutlinePencilAlt /> Edit Listing
                    </button>
                )}
            </div>

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

                    <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
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

            {/* Edit Product Modal */}
            {isEditModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100, padding: '20px' }}>
                    <div className="card-premium" style={{ backgroundColor: '#fff', width: '100%', maxWidth: '600px', borderRadius: '24px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid #f3f4f6' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0 }}>Edit Product Information</h2>
                            <button onClick={() => setIsEditModalOpen(false)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                <HiOutlineX />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.9rem', color: '#374151' }}>Product Name *</label>
                                <input
                                    type="text"
                                    className="fancy-input"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.9rem', color: '#374151' }}>Price (₹) *</label>
                                    <input
                                        type="number"
                                        className="fancy-input"
                                        value={editForm.price}
                                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.9rem', color: '#374151' }}>Category</label>
                                    <select
                                        className="fancy-input"
                                        value={editForm.category}
                                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.9rem', color: '#374151' }}>Image URL</label>
                                <input
                                    type="text"
                                    className="fancy-input"
                                    value={editForm.image}
                                    onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.9rem', color: '#374151' }}>Location</label>
                                <input
                                    type="text"
                                    className="fancy-input"
                                    value={editForm.location}
                                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.9rem', color: '#374151' }}>Description</label>
                                <textarea
                                    className="fancy-input"
                                    style={{ minHeight: '100px', resize: 'vertical' }}
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.9rem', color: '#374151' }}>Seller Name</label>
                                    <input
                                        type="text"
                                        className="fancy-input"
                                        value={editForm.sellerName}
                                        onChange={(e) => setEditForm({ ...editForm, sellerName: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.9rem', color: '#374151' }}>Contact Phone</label>
                                    <input
                                        type="text"
                                        className="fancy-input"
                                        value={editForm.phone}
                                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="btn-secondary"
                                    style={{ flex: 1, justifyContent: 'center' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    style={{ flex: 2, justifyContent: 'center' }}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Saving...' : <><HiOutlineSave /> Save Changes</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* CSS for grid layout and inputs */}
            <style>{`
                @media (min-width: 1024px) {
                    .grid-2-desktop {
                        grid-template-columns: 1fr 1fr !important;
                    }
                }
                .fancy-input {
                    width: 100%;
                    padding: 12px 16px;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 0.95rem;
                    transition: all 0.2s;
                    background: #f8fafc;
                }
                .fancy-input:focus {
                    outline: none;
                    border-color: var(--primary-color);
                    background: #fff;
                    box-shadow: 0 0 0 4px rgba(0, 153, 0, 0.1);
                }
            `}</style>
        </div>
    );
};

export default ProductDetail;
