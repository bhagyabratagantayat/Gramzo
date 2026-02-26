import { useState, useEffect } from 'react';
import api from '../services/api';

const AddProductForm = ({ onClose, onProductAdded }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        sellerName: '',
        phone: '',
        location: '',
        image: ''
    });
    const [categories, setCategories] = useState([]);
    const [catLoading, setCatLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCatLoading(true);
                const response = await api.get('/categories');
                const productCats = response.data.data.filter(cat => cat.type === 'product' || cat.type === 'market');
                setCategories(productCats);
                setCatLoading(false);
            } catch (err) {
                console.error('Failed to fetch categories');
                setCatLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const user = JSON.parse(localStorage.getItem('gramzoUser'));
            const productData = {
                ...formData,
                agentId: user?._id,
                phone: user?.phone,
                sellerName: user?.name
            };
            await api.post('/products/add', productData);
            setSuccess('Product Added Successfully!');
            setLoading(false);
            onProductAdded();
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add product');
            setLoading(false);
        }
    };

    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    };

    const modalStyle = {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '12px',
        width: '450px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
    };

    const inputStyle = {
        width: '100%',
        padding: '8px',
        boxSizing: 'border-box',
        marginBottom: '10px'
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h2 style={{ marginTop: 0 }}>Add New Product</h2>

                {success && <p style={{ color: 'green', fontWeight: 'bold' }}>{success}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <label>Title:</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required style={inputStyle} />

                    <label>Description:</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px' }} />

                    <label>Price:</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} required style={inputStyle} />

                    <label>Category:</label>
                    <select name="category" value={formData.category} onChange={handleChange} required style={inputStyle}>
                        {catLoading ? (
                            <option value="">Loading categories...</option>
                        ) : categories.length === 0 ? (
                            <option value="">No categories found</option>
                        ) : (
                            <>
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </>
                        )}
                    </select>

                    <label>Seller Name:</label>
                    <input type="text" name="sellerName" value={formData.sellerName} onChange={handleChange} required style={inputStyle} />

                    <label>Phone:</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required style={inputStyle} />

                    <label>Location:</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} required style={inputStyle} />

                    <label>Product Image URL (e.g., Unsplash):</label>
                    <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="https://images.unsplash.com/..." style={inputStyle} />

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button type="submit" disabled={loading} style={{ flex: 1, padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            {loading ? 'Adding...' : 'Add Product'}
                        </button>
                        <button type="button" onClick={onClose} style={{ padding: '10px', backgroundColor: '#ccc', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductForm;
