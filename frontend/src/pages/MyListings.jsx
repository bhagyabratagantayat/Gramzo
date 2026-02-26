import { useState, useEffect } from 'react';
import api from '../services/api';
import { getUser } from '../services/auth';
import { HiOutlineTrash, HiOutlineShoppingBag, HiOutlineCalendar, HiOutlineInformationCircle } from 'react-icons/hi';

const MyListings = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = getUser();

    const fetchMyListings = async () => {
        setLoading(true);
        try {
            // Fetch Services
            const sRes = await api.get(`/services?agent=${user._id}`);
            setServices(sRes.data.data);
        } catch (err) {
            console.error('Failed to fetch listings', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchMyListings();
    }, []);

    const handleDeleteService = async (id) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;
        try {
            await api.delete(`/services/${id}`);
            setServices(services.filter(s => s._id !== id));
        } catch (err) {
            alert('Failed to delete service');
        }
    };


    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-muted)' }}>
            Loading your listings...
        </div>
    );

    const sectionStyle = {
        marginBottom: '60px'
    };

    const gridStyle = {
        display: 'grid',
        gap: '20px',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))'
    };

    const itemCardStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    };

    const deleteBtnStyle = {
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        border: 'none',
        padding: '10px',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: '700',
        marginTop: '20px',
        transition: 'var(--transition)'
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
            <header style={{ marginBottom: '48px' }}>
                <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.025em' }}>My Listings</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '12px' }}>
                    Manage the professional services you offer to the community. Products can be managed in My Marketplace.
                </p>
            </header>

            {/* Services Section */}
            <section style={sectionStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                        <HiOutlineCalendar />
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>Active Services</h2>
                </div>

                {services.length > 0 ? (
                    <div style={gridStyle}>
                        {services.map(service => (
                            <div key={service._id} className="card" style={itemCardStyle}>
                                <div>
                                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>{service.title}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>{service.description}</p>
                                    <div style={{ marginTop: '12px', fontWeight: '700', color: 'var(--primary-color)' }}>₹{service.price}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                    <button onClick={() => handleDeleteService(service._id)} style={{ ...deleteBtnStyle, flex: 1, marginTop: 0 }} className="hover-lift">
                                        <HiOutlineTrash /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#f9fafb', borderRadius: '20px', border: '1px dashed #e5e7eb' }}>
                        <HiOutlineCalendar style={{ fontSize: '2rem', color: '#9ca3af', marginBottom: '12px' }} />
                        <p style={{ color: '#6b7280', margin: 0 }}>You haven't listed any services yet.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default MyListings;
