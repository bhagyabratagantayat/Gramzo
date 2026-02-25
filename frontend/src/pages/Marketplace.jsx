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
            setProducts([]);
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
                    <div key={product._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800' }}>{product.title}</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', backgroundColor: 'var(--bg-color)', padding: '4px 10px', borderRadius: '20px' }}>
                                <HiOutlineLocationMarker /> {product.location}
                            </div>
                        </div>

                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0, flex: 1 }}>{product.description}</p>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                            <span style={{ fontSize: '2rem', fontWeight: '900', color: '#ea580c' }}>₹{product.price}</span>
                        </div>

                        <div style={{ padding: '16px', backgroundColor: '#fff7ed', borderRadius: '12px', border: '1px solid #ffedd5' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#9a3412', fontWeight: '800', fontSize: '0.9rem' }}>
                                <HiOutlineTag /> Seller Details
                            </div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '4px' }}>{product.sellerName}</div>
                            <div style={{ color: '#ea580c', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <HiOutlinePhone /> {product.phone}
                            </div>
                        </div>

                        <button style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'white',
                            color: 'var(--text-main)',
                            fontWeight: '700',
                            transition: 'var(--transition)',
                            cursor: 'pointer'
                        }}>
                            Contact Seller
                        </button>
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
