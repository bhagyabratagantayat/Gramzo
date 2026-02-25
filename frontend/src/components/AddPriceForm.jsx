import { useState } from 'react';
import api from '../services/api';

const AddPriceForm = ({ onClose, onPriceAdded }) => {
    const [formData, setFormData] = useState({
        item: '',
        price: '',
        location: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

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
            const priceData = {
                ...formData,
                agent: user?.agentId
            };
            await api.post('/prices/add', priceData);
            setSuccess('Price Updated Successfully!');
            setLoading(false);
            onPriceAdded();
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update price');
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
        width: '400px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        marginBottom: '15px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        fontSize: '1rem'
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Update Market Rate</h2>

                {success && <p style={{ color: 'green', fontWeight: 'bold' }}>{success}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Commodity Item:</label>
                    <input type="text" name="item" placeholder="e.g., Wheat, Rice" value={formData.item} onChange={handleChange} required style={inputStyle} />

                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Price (per unit):</label>
                    <input type="number" name="price" placeholder="Enter amount" value={formData.price} onChange={handleChange} required style={inputStyle} />

                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Location:</label>
                    <input type="text" name="location" placeholder="Market/Village name" value={formData.location} onChange={handleChange} required style={inputStyle} />

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button type="submit" disabled={loading} style={{ flex: 1, padding: '12px', backgroundColor: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>
                            {loading ? 'Updating...' : 'Publish Rate'}
                        </button>
                        <button type="button" onClick={onClose} style={{ padding: '12px', backgroundColor: '#eee', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPriceForm;
