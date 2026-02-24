import { useState, useEffect } from 'react';
import api from '../services/api';
import AddProductForm from '../components/AddProductForm';

const Marketplace = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch products. Please try again later.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) return <div style={{ padding: '20px' }}>Loading marketplace...</div>;
    if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Gramzo Marketplace</h1>
                <button
                    onClick={() => setShowAddForm(true)}
                    style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Add Product
                </button>
            </div>

            <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {products.map((product) => (
                    <div key={product._id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>{product.title}</h2>
                        <p style={{ color: '#666' }}>{product.description}</p>
                        <p><strong>Price:</strong> ₹{product.price}</p>
                        <p><strong>Seller:</strong> {product.sellerName}</p>
                        <p><strong>Phone:</strong> {product.phone}</p>
                        <p><strong>Location:</strong> {product.location}</p>
                    </div>
                ))}
                {products.length === 0 && <p>No products available in the marketplace yet.</p>}
            </div>

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
