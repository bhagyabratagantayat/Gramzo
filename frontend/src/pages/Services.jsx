import { useState, useEffect } from 'react';
import api from '../services/api';
import BookingForm from '../components/BookingForm';
import AddServiceForm from '../components/AddServiceForm';
import { isAgent } from '../services/auth';
import { demoServices } from '../services/demoData';
import { HiOutlineMap, HiOutlineCurrencyRupee, HiOutlineInformationCircle, HiOutlineUserCircle } from 'react-icons/hi';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchServices = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('gramzoUser'));
            let url = '/services';
            if (user?.role === 'Agent' && user?.agentId) {
                url += `?agent=${user.agentId}`;
            }

            const response = await api.get(url);
            const data = response.data.data;
            setServices(data.length > 0 ? data : (user?.role === 'Agent' ? [] : demoServices));
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch services');
            setServices([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const openBooking = (service) => setSelectedService(service);
    const closeBooking = () => setSelectedService(null);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-muted)' }}>
            Loading available services...
        </div>
    );

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', gap: '24px', flexWrap: 'wrap' }}>
                <div>
                    <div style={{ color: 'var(--primary-color)', fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                        Community Support
                    </div>
                    <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800' }}>Local Services</h1>
                </div>
                {isAgent() && (
                    <button onClick={() => setShowAddForm(true)} className="btn-primary">
                        List a New Service
                    </button>
                )}
            </header>

            <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))' }}>
                {services.map((service) => (
                    <div key={service._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <h2 style={{ margin: '0 0 12px 0', fontSize: '1.5rem', fontWeight: '800' }}>{service.title}</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>{service.description}</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', backgroundColor: 'var(--border-color)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                            <div style={{ backgroundColor: 'var(--bg-color)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fee</div>
                                <div style={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <HiOutlineCurrencyRupee /> {service.price}
                                </div>
                            </div>
                            <div style={{ backgroundColor: 'var(--bg-color)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Location</div>
                                <div style={{ fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <HiOutlineMap style={{ color: 'var(--text-muted)' }} /> {service.location}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: 'rgba(37, 99, 235, 0.05)', borderRadius: '12px', border: '1px solid rgba(37, 99, 235, 0.1)' }}>
                            <HiOutlineUserCircle style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }} />
                            <div style={{ fontSize: '0.9rem' }}>
                                <div style={{ color: 'var(--text-muted)' }}>Service Provider</div>
                                <div style={{ fontWeight: '700' }}>{service.agent?.name || 'Verified Professional'}</div>
                            </div>
                        </div>

                        <button
                            onClick={() => openBooking(service)}
                            className="btn-primary"
                            style={{ width: '100%', padding: '14px' }}
                        >
                            Book Appointment
                        </button>
                    </div>
                ))}
            </div>

            {services.length === 0 && (
                <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: '#fff', borderRadius: 'var(--radius)', border: '1px dashed var(--border-color)' }}>
                    <HiOutlineInformationCircle style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '16px' }} />
                    <h3 style={{ margin: 0 }}>No services listed yet</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Check back soon for new local services being offered in your area.</p>
                </div>
            )}

            {selectedService && (
                <BookingForm
                    serviceId={selectedService._id}
                    serviceTitle={selectedService.title}
                    onClose={closeBooking}
                />
            )}

            {showAddForm && (
                <AddServiceForm
                    onClose={() => setShowAddForm(false)}
                    onServiceAdded={fetchServices}
                />
            )}
        </div>
    );
};

export default Services;
