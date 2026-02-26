import { useState, useEffect } from 'react';
import api from '../services/api';
import AddProductForm from '../components/AddProductForm';
import { demoProducts } from '../services/demoData';
import { isAgent } from '../services/auth';
import { HiOutlineTag, HiOutlineLocationMarker, HiOutlinePhone, HiOutlineShoppingBag } from 'react-icons/hi';

const Marketplace = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchProducts = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('gramzoUser'));
            let url = '/products';
            if (user?.role === 'Agent' && user?.phone) {
                url += `?phone=${user.phone}`;
            }

            const response = await api.get(url);
            const data = response.data.data;
            setProducts(data.length > 0 ? data : (user?.role === 'Agent' ? [] : demoProducts));
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch products');
            setProducts(demoProducts);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-muted)' }}>
            Opening the marketplace...
        </div>
    );

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', gap: '24px', flexWrap: 'wrap' }}>
                <div>
                    <div style={{ color: '#ea580c', fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                        Local Trade
                    </div>
                    <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800' }}>Gramzo Marketplace</h1>
                </div>
                {isAgent() && (
                    <button onClick={() => setShowAddForm(true)} className="btn-primary" style={{ backgroundColor: '#ea580c' }}>
                        Sell a Product
                    </button>
                )}
            </header>

            <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                {products.map((product) => (
                    <div key={product._id} className="service-card">
                        {/* Card image / icon area */}
                        <div className="service-card-img" style={product.image ? { padding: 0 } : {}}>
                            {product.image
                                ? <img
                                    src={product.image}
                                    alt={product.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://via.placeholder.com/300";
                                    }}
                                />
                                : <div style={{ fontSize: '3rem', color: 'var(--text-muted)' }}><HiOutlineShoppingBag /></div>
                            }
                        </div>

                        {/* Card body */}
                        <div className="service-card-body">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                                <div>
                                    {product.category?.name && (
                                        <div className="service-card-category" style={{ color: '#ea580c' }}>
                                            {product.category.name}
                                        </div>
                                    )}
                                    <h3 className="service-card-title">{product.title}</h3>
                                </div>
                                <div className="filter-chip" style={{ backgroundColor: '#fff7ed', color: '#ea580c', borderColor: '#ffedd5', flexShrink: 0 }}>
                                    <HiOutlineLocationMarker /> {product.location}
                                </div>
                            </div>

                            <p className="service-card-desc">{product.description}</p>

                            <div style={{ marginTop: 'auto' }}>
                                <div className="service-card-price" style={{ color: '#ea580c' }}>
                                    ₹{product.price}
                                </div>
                            </div>
                        </div>

                        {/* Seller Details Section */}
                        <div style={{ padding: '0 16px 12px' }}>
                            <div style={{ padding: '12px', backgroundColor: '#fff7ed', borderRadius: '12px', border: '1px solid #ffedd5' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: '#9a3412', fontWeight: '800', fontSize: '0.85rem' }}>
                                    <HiOutlineTag /> Seller: {product.sellerName}
                                </div>
                                <div style={{ color: '#ea580c', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                                    <HiOutlinePhone /> {product.phone}
                                </div>
                            </div>
                        </div>

                        <div className="service-card-footer">
                            <button className="btn-primary btn-full" style={{ backgroundColor: '#ea580c' }}>
                                Contact Seller
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {products.length === 0 && (
                <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: '#fff', borderRadius: 'var(--radius)', border: '1px dashed var(--border-color)' }}>
                    <HiOutlineShoppingBag style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '16px' }} />
                    <h3 style={{ margin: 0 }}>Market is empty</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Be the first to list a product and reach your local community!</p>
                </div>
            )}

            {showAddForm && (
                <AddProductForm
                    onClose={() => setShowAddForm(false)}
                    onProductAdded={fetchProducts}
                />
            )}
        </div>
    );
};

export default Marketplace;
