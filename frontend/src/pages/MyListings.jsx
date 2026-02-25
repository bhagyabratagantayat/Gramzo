import { useState, useEffect } from 'react';
import api from '../services/api';
import { getUser } from '../services/auth';
import { HiOutlineTrash, HiOutlineShoppingBag, HiOutlineCalendar, HiOutlineInformationCircle } from 'react-icons/hi';

const MyListings = () => {
    const [services, setServices] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = getUser();

    const fetchMyListings = async () => {
        setLoading(true);
        try {
            // Fetch Services
            const sRes = await api.get(`/services?agent=${user.agentId}`);
            setServices(sRes.data.data);

            // Fetch Products
            const pRes = await api.get(`/products?phone=${user.phone}`);
            setProducts(pRes.data.data);
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

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter(p => p._id !== id));
        } catch (err) {
            alert('Failed to delete product');
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
                    Manage the services and products you have shared with the community.
                </p>
            </header>

            {/* Services Section */}
            <section style={sectionStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                        <HiOutlineCalendar />
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>My Services</h2>
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
                                <button onClick={() => handleDeleteService(service._id)} style={deleteBtnStyle} className="hover-lift">
                                    <HiOutlineTrash /> Remove Service
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>You haven't listed any services yet.</p>
                )}
            </section>

            {/* Products Section */}
            <section style={sectionStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                        <HiOutlineShoppingBag />
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>My Products</h2>
                </div>

                {products.length > 0 ? (
                    <div style={gridStyle}>
                        {products.map(product => (
                            <div key={product._id} className="card" style={itemCardStyle}>
                                <div>
                                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>{product.title}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>{product.description}</p>
                                    <div style={{ marginTop: '12px', fontWeight: '700', color: '#ea580c' }}>₹{product.price}</div>
                                </div>
                                <button onClick={() => handleDeleteProduct(product._id)} style={deleteBtnStyle} className="hover-lift">
                                    <HiOutlineTrash /> Remove Item
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>You haven't listed any products yet.</p>
                )}
            </section>
        </div>
    );
};

export default MyListings;
