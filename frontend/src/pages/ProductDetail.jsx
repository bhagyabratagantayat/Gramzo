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
        <div className="product-detail-container app-container py-12">
            <header className="flex-between mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="btn-back"
                >
                    <HiOutlineArrowLeft /> Back
                </button>

                {isOwner && (
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="btn-secondary flex-center gap-2"
                    >
                        <HiOutlinePencilAlt /> Edit Listing
                    </button>
                )}
            </header>

            <div className="detail-grid">
                {/* Image Section */}
                <div className="detail-image-card">
                    <img
                        src={product.image || getFallbackImage(product.title, product.category?.name)}
                        alt={product.title}
                        className="detail-main-img"
                        onError={(e) => { e.target.src = getFallbackImage(product.title, product.category?.name); }}
                    />
                    <div className="detail-badge badge glass-morphism">
                        {product.category?.name || 'Local Marketplace'}
                    </div>
                </div>

                {/* Info Section */}
                <div className="detail-info-pane">
                    <div className="detail-eyebrow">Fresh from Village</div>
                    <h1 className="detail-title">{product.title}</h1>
                    
                    <div className="detail-price-tag">₹{product.price}</div>

                    <div className="detail-section-card">
                        <h3>Description</h3>
                        <p>{product.description || "No detailed description provided for this item. Contact the seller for more information about quality and availability."}</p>
                    </div>

                    <div className="detail-meta-group">
                        <div className="detail-meta-chip">
                            <HiOutlineLocationMarker /> {product.location || 'Local area'}
                        </div>
                        <div className="detail-meta-chip">
                            <HiOutlineTag /> {product.sellerName || 'Verified Seller'}
                        </div>
                    </div>

                    <div className="detail-action-footer">
                        {isAuthenticated ? (
                            <div className="flex gap-4">
                                <button className="btn-primary flex-1 py-4 text-lg">
                                    <HiOutlineShoppingBag /> Contact Seller
                                </button>
                                <a href={`tel:${product.phone || ''}`} className="btn-secondary p-4 flex-center">
                                    <HiOutlinePhone className="text-2xl" />
                                </a>
                            </div>
                        ) : (
                            <div className="detail-login-alert">
                                <p>Login to contact the seller and buy this product.</p>
                                <button onClick={() => navigate('/login')} className="btn-primary mt-4">Login Now</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Product Modal */}
            {isEditModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content max-w-2xl">
                        <div className="modal-header">
                            <h2>Edit Product Information</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="modal-close">
                                <HiOutlineX />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Product Name *</label>
                                <input
                                    type="text"
                                    className="fancy-input"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price (₹) *</label>
                                    <input
                                        type="number"
                                        className="fancy-input"
                                        value={editForm.price}
                                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
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
                                <label>Image URL</label>
                                <input
                                    type="text"
                                    className="fancy-input"
                                    value={editForm.image}
                                    onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    className="fancy-input"
                                    value={editForm.location}
                                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    className="fancy-input h-32"
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Seller Name</label>
                                    <input
                                        type="text"
                                        className="fancy-input"
                                        value={editForm.sellerName}
                                        onChange={(e) => setEditForm({ ...editForm, sellerName: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Contact Phone</label>
                                    <input
                                        type="text"
                                        className="fancy-input"
                                        value={editForm.phone}
                                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary flex-2"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Saving...' : <><HiOutlineSave /> Save Changes</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
