import { useState, useEffect } from 'react';
import api from '../services/api';

const AddServiceForm = ({ onClose, onServiceAdded }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        location: ''
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
                const serviceCats = response.data.data.filter(cat => cat.type === 'service');
                setCategories(serviceCats);
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
            const serviceData = {
                ...formData,
                agent: user?.agentId
            };
            await api.post('/services/add', serviceData);
            setSuccess('Service Added Successfully!');
            setLoading(false);
            onServiceAdded();
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add service');
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
        marginBottom: '10px',
        borderRadius: '4px',
        border: '1px solid #ddd'
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h2 style={{ marginTop: 0 }}>Add New Service</h2>

                {success && <p style={{ color: 'green', fontWeight: 'bold' }}>{success}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <label>Service Title:</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required style={inputStyle} />

                    <label>Description:</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px' }} />

                    <label>Consultation Fee:</label>
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

                    <label>Location:</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} required style={inputStyle} />

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button type="submit" disabled={loading} style={{ flex: 1, padding: '10px', backgroundColor: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            {loading ? 'Adding...' : 'Add Service'}
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

export default AddServiceForm;
