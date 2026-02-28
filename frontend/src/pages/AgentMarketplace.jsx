import { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import AddProductForm from '../components/AddProductForm';
import { getUser } from '../services/auth';
import { HiOutlineTag, HiOutlineLocationMarker, HiOutlinePhone, HiOutlineShoppingBag, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';

const AgentMarketplace = () => {
    const user = getUser();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchAgentProducts = async () => {
        if (!user?._id) return;
        try {
            const response = await api.get(`/products/agent/${user._id}`);
            setProducts(response.data.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch agent products');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgentProducts();
    }, [user?._id]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            fetchAgentProducts();
        } catch (err) {
            alert('Failed to delete product');
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-muted)' }}>
            Loading your marketplace...
        </div>
    );

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', gap: '24px', flexWrap: 'wrap' }}>
                <div>
                    <div style={{ color: '#ea580c', fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                        Merchant Dashboard
                    </div>
                    <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800' }}>My Marketplace</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Manage and monitor your listed products for the local community.</p>
                </div>
                <button onClick={() => setShowAddForm(true)} className="btn-primary" style={{ backgroundColor: '#ea580c', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HiOutlinePlus /> Add New Product
                </button>
            </header>

            {products.length > 0 ? (
                <div className="responsive-grid">
                    {products.map((product) => (
                        <div key={product._id} className="service-card" style={{ position: 'relative' }}>
                            <div className="service-card-img" style={product.image ? { padding: 0 } : {}}>
                                {product.image
                                    ? <img
                                        src={product.image}
                                        alt={product.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => { e.target.src = "https://via.placeholder.com/300"; }}
                                    />
                                    : <div style={{ fontSize: '3rem', color: 'var(--text-muted)' }}><HiOutlineShoppingBag /></div>
                                }
                                <div className="service-card-badge" style={{ backgroundColor: '#10b981' }}>Live</div>
                            </div>

                            <button
                                onClick={() => handleDelete(product._id)}
                                style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    color: '#ef4444',
                                    border: 'none',
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                    zIndex: 5
                                }}
                                title="Delete Product"
                            >
                                <HiOutlineTrash />
                            </button>

                            <div className="service-card-body">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                                    <h3 className="service-card-title">{product.title}</h3>
                                    <div className="filter-chip" style={{ backgroundColor: '#fff7ed', color: '#ea580c', borderColor: '#ffedd5', flexShrink: 0 }}>
                                        <HiOutlineLocationMarker /> {product.location}
                                    </div>
                                </div>
                                <p className="service-card-desc">{product.description}</p>
                                <div style={{ marginTop: 'auto' }}>
                                    <div className="service-card-price" style={{ color: '#ea580c' }}>₹{product.price}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: '#fff', borderRadius: 'var(--radius)', border: '1px dashed var(--border-color)' }}>
                    <HiOutlineShoppingBag style={{ fontSize: '3.5rem', color: '#fdba74', marginBottom: '16px' }} />
                    <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Your market stands still</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px', maxWidth: '300px', marginInline: 'auto' }}>
                        You haven't listed any products yet. Start adding your inventory to reach local customers!
                    </p>
                    <button onClick={() => setShowAddForm(true)} className="btn-primary" style={{ backgroundColor: '#ea580c', marginTop: '24px' }}>
                        List Your First Product
                    </button>
                </div>
            )}

            {showAddForm && (
                <AddProductForm
                    onClose={() => setShowAddForm(false)}
                    onProductAdded={fetchAgentProducts}
                />
            )}
        </div>
    );
};

export default AgentMarketplace;
