import { useState, useEffect } from 'react';
import api from '../services/api';
import { requestGPSLocation } from '../services/location';
import {
    HiOutlineLocationMarker,
    HiOutlineX,
    HiOutlineCheckCircle,
    HiOutlineExclamationCircle
} from 'react-icons/hi';

const AddServiceForm = ({ onClose, onServiceAdded }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        location: '',      // old text field — kept for backward compat
        locationName: '',  // human-readable place name
        requiresAppointment: false,
        image: '',
    });
    const [coords, setCoords] = useState({ lat: null, lng: null }); // GPS coords stored separately
    const [gpsStatus, setGpsStatus] = useState(null); // null | 'loading' | 'ok' | 'denied'

    const [categories, setCategories] = useState([]);
    const [catLoading, setCatLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                setCategories(res.data.data.filter(c => c.type === 'service'));
            } catch {
                console.error('Failed to fetch categories');
            } finally {
                setCatLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    /* ── GPS auto-fill ── */
    const handleUseMyLocation = async () => {
        setGpsStatus('loading');
        try {
            const { lat, lng } = await requestGPSLocation();
            setCoords({ lat, lng });
            setGpsStatus('ok');
            // Prefill locationName from coords using browser-side reverse geocoding is optional;
            // just show the coords in the location text field as a fallback label
            setFormData(prev => ({
                ...prev,
                location: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
                locationName: prev.locationName // keep whatever they typed
            }));
        } catch {
            setGpsStatus('denied');
        }
    };

    const clearGps = () => {
        setCoords({ lat: null, lng: null });
        setGpsStatus(null);
        setFormData(prev => ({ ...prev, location: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const user = JSON.parse(localStorage.getItem('gramzoUser'));
            const payload = {
                ...formData,
                agentId: user?._id,
                // Include GPS coords only if captured
                ...(coords.lat !== null && { latitude: coords.lat, longitude: coords.lng }),
                // locationName falls back to the manual location text if not separately filled
                locationName: formData.locationName || formData.location,
            };
            await api.post('/services/add', payload);
            setSuccess('Service added successfully!');
            onServiceAdded();
            setTimeout(() => onClose(), 1800);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add service.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(15,23,42,0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1500, padding: '20px'
        }}>
            <div style={{
                backgroundColor: '#fff', borderRadius: '20px',
                width: '100%', maxWidth: '500px', maxHeight: '92vh',
                overflowY: 'auto',
                boxShadow: '0 24px 60px rgba(0,0,0,0.2)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px 24px', borderBottom: '1px solid var(--border-color)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'linear-gradient(135deg,#eff6ff,#fff)'
                }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Agent Portal</div>
                        <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>Add New Service</h2>
                    </div>
                    <button onClick={onClose} style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '6px', display: 'flex', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        <HiOutlineX style={{ fontSize: '1.1rem' }} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '24px' }}>
                    {success && (
                        <div className="alert alert-success" style={{ marginBottom: '20px' }}>
                            <HiOutlineCheckCircle style={{ flexShrink: 0 }} /> {success}
                        </div>
                    )}
                    {error && (
                        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
                            <HiOutlineExclamationCircle style={{ flexShrink: 0 }} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Title */}
                        <div className="form-group">
                            <label className="form-label">Service Title</label>
                            <input type="text" name="title" className="form-input" placeholder="e.g. Home Plumbing Repair" value={formData.title} onChange={handleChange} required />
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea name="description" className="form-input" placeholder="Briefly describe the service..." value={formData.description} onChange={handleChange} style={{ minHeight: '80px', resize: 'vertical' }} />
                        </div>

                        {/* Price */}
                        <div className="form-group">
                            <label className="form-label">Consultation Fee (₹)</label>
                            <input type="number" name="price" className="form-input" placeholder="e.g. 500" min="0" value={formData.price} onChange={handleChange} required />
                        </div>

                        {/* Category */}
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select name="category" className="form-select" value={formData.category} onChange={handleChange} required>
                                {catLoading ? (
                                    <option value="">Loading categories…</option>
                                ) : categories.length === 0 ? (
                                    <option value="">No categories found</option>
                                ) : (
                                    <>
                                        <option value="">Select category</option>
                                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </>
                                )}
                            </select>
                        </div>

                        {/* ── Location section ── */}
                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Location</span>
                                {/* GPS button */}
                                {gpsStatus !== 'ok' ? (
                                    <button
                                        type="button"
                                        onClick={handleUseMyLocation}
                                        disabled={gpsStatus === 'loading'}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '5px',
                                            padding: '4px 10px', borderRadius: '8px', border: '1.5px solid var(--primary-color)',
                                            backgroundColor: 'transparent', color: 'var(--primary-color)',
                                            fontWeight: '700', fontSize: '0.8rem', cursor: gpsStatus === 'loading' ? 'wait' : 'pointer'
                                        }}
                                    >
                                        {gpsStatus === 'loading'
                                            ? <><span className="spinner" style={{ width: '13px', height: '13px', borderWidth: '2px' }} /> Detecting…</>
                                            : <><HiOutlineLocationMarker /> Use My Location</>}
                                    </button>
                                ) : (
                                    <button type="button" onClick={clearGps} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '8px', border: '1.5px solid #6ee7b7', backgroundColor: '#ecfdf5', color: '#065f46', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}>
                                        <HiOutlineCheckCircle /> GPS Active <HiOutlineX style={{ marginLeft: '2px' }} />
                                    </button>
                                )}
                            </label>

                            {/* GPS coords pill */}
                            {gpsStatus === 'ok' && (
                                <div style={{ margin: '0 0 8px', padding: '6px 12px', backgroundColor: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '8px', fontSize: '0.82rem', color: '#065f46', fontWeight: '600' }}>
                                    📍 GPS: {coords.lat?.toFixed(5)}, {coords.lng?.toFixed(5)}
                                </div>
                            )}
                            {gpsStatus === 'denied' && (
                                <div style={{ margin: '0 0 8px', padding: '6px 12px', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', fontSize: '0.82rem', color: '#92400e', fontWeight: '600' }}>
                                    ⚠️ GPS denied — please enter location manually below.
                                </div>
                            )}

                            {/* Location name — always editable */}
                            <input
                                type="text" name="locationName" className="form-input"
                                placeholder="Location name, e.g. Puri Market"
                                value={formData.locationName}
                                onChange={handleChange}
                                required={gpsStatus !== 'ok'}
                            />
                            <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                Enter village/city name. GPS coordinates are captured separately when available.
                            </p>
                        </div>

                        {/* Image URL */}
                        <div className="form-group">
                            <label className="form-label">Service Image URL</label>
                            <input type="text" name="image" className="form-input" placeholder="Enter image URL (e.g. from Unsplash)" value={formData.image} onChange={handleChange} />
                        </div>

                        {/* Appointment toggle */}
                        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                            <input
                                type="checkbox" id="requiresAppointment" name="requiresAppointment"
                                checked={formData.requiresAppointment} onChange={handleChange}
                                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary-color)' }}
                            />
                            <label htmlFor="requiresAppointment" style={{ fontWeight: '600', cursor: 'pointer', margin: 0, fontSize: '0.92rem' }}>
                                Requires scheduled appointment <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(shows date/time picker to users)</span>
                            </label>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1, padding: '13px', justifyContent: 'center' }}>
                                {loading
                                    ? <><span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> Adding…</>
                                    : 'Add Service'}
                            </button>
                            <button type="button" onClick={onClose} className="btn-ghost" style={{ padding: '13px 18px' }}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddServiceForm;
