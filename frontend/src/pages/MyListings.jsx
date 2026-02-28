import { useState, useEffect } from 'react';
import api from '../services/api';
import { getUser } from '../services/auth';
import { HiOutlineTrash, HiOutlineShoppingBag, HiOutlineCalendar, HiOutlinePlus } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const MyListings = () => {
    const [services, setServices] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = getUser();
    const navigate = useNavigate();

    const fetchMyListings = async () => {
        if (!user?._id) return;
        setLoading(true);
        try {
            const [sRes, pRes] = await Promise.all([
                api.get(`/services/agent/${user._id}`),
                api.get(`/products/agent/${user._id}`)
            ]);
            setServices(sRes.data.data || []);
            setProducts(pRes.data.data || []);
        } catch (err) {
            console.error('Failed to fetch listings', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchMyListings();
    }, [user?._id]);

    const handleDelete = async (type, id) => {
        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
        try {
            await api.delete(`/${type}s/${id}`);
            if (type === 'service') setServices(services.filter(s => s._id !== id));
            else setProducts(products.filter(p => p._id !== id));
        } catch (err) {
            alert(`Failed to delete ${type}`);
        }
    };

    if (loading) return (
        <div className="flex-center" style={{ height: '60vh' }}>
            <div className="spinner"></div>
        </div>
    );

    return (
        <div className="page-wrapper">
            <header style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
                <div>
                    <h1 className="section-title">Merchant Dashboard</h1>
                    <p className="section-sub">Manage your professional services and marketplace products.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => navigate('/agent/marketplace')} className="btn-primary" style={{ backgroundColor: '#ea580c' }}>
                        <HiOutlinePlus /> Marketplace
                    </button>
                    <button onClick={() => navigate('/services')} className="btn-primary">
                        <HiOutlinePlus /> Add Service
                    </button>
                </div>
            </header>

            {/* Products Section */}
            <section className="section-spacer">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                        <HiOutlineShoppingBag />
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>Listed Products</h2>
                </div>

                {products.length > 0 ? (
                    <div className="responsive-grid">
                        {products.map(product => (
                            <div key={product._id} className="service-card">
                                <div className="service-card-img">
                                    {product.image ? (
                                        <img src={product.image} alt={product.title} />
                                    ) : (
                                        <HiOutlineShoppingBag />
                                    )}
                                </div>
                                <div className="service-card-body">
                                    <h3 className="service-card-title">{product.title}</h3>
                                    <p className="service-card-desc">{product.description}</p>
                                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div className="service-card-price">₹{product.price}</div>
                                        <button onClick={() => handleDelete('product', product._id)} className="logout-btn" style={{ color: '#ef4444' }}>
                                            <HiOutlineTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state" style={{ padding: '40px' }}>
                        <p>No products listed yet.</p>
                    </div>
                )}
            </section>

            {/* Services Section */}
            <section className="section-spacer">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                        <HiOutlineCalendar />
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>Professional Services</h2>
                </div>

                {services.length > 0 ? (
                    <div className="responsive-grid">
                        {services.map(service => (
                            <div key={service._id} className="service-card">
                                <div className="service-card-img">
                                    {service.image ? (
                                        <img src={service.image} alt={service.title} />
                                    ) : (
                                        <HiOutlineCalendar />
                                    )}
                                </div>
                                <div className="service-card-body">
                                    <h3 className="service-card-title">{service.title}</h3>
                                    <p className="service-card-desc">{service.description}</p>
                                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div className="service-card-price">₹{service.price}</div>
                                        <button onClick={() => handleDelete('service', service._id)} className="logout-btn" style={{ color: '#ef4444' }}>
                                            <HiOutlineTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state" style={{ padding: '40px' }}>
                        <p>No services listed yet.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default MyListings;
