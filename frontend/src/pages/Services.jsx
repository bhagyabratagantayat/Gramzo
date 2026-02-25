import { useState, useEffect } from 'react';
import api from '../services/api';
import BookingForm from '../components/BookingForm';
import AddServiceForm from '../components/AddServiceForm';
import { isAgent } from '../services/auth';
import { demoServices } from '../services/demoData';
import { getSavedLocation } from '../services/location';
import { HiOutlineMap, HiOutlineCurrencyRupee, HiOutlineInformationCircle, HiOutlineUserCircle, HiOutlineLocationMarker, HiX } from 'react-icons/hi';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [locationFilter, setLocationFilter] = useState(() => {
        // Read saved location once on mount
        const saved = getSavedLocation();
        return saved?.locationName && saved.source !== 'skipped' ? saved.locationName : null;
    });

    const fetchServices = async (locFilter = locationFilter) => {
        try {
            const user = JSON.parse(localStorage.getItem('gramzoUser'));
            const params = new URLSearchParams();

            // Agent sees only their own services — location filter doesn't apply
            if (user?.role === 'Agent' && user?.agentId) {
                params.set('agent', user.agentId);
            } else if (locFilter) {
                // Non-agent users: filter by location name
                params.set('locationName', locFilter);
            }

            const url = `/services${params.toString() ? '?' + params.toString() : ''}`;
            const response = await api.get(url);
            const data = response.data.data;
            setServices(data.length > 0 ? data : (user?.role === 'Agent' ? [] : demoServices));
        } catch (err) {
            console.error('Failed to fetch services:', err);
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchServices(); }, []);

    const clearLocationFilter = () => {
        setLocationFilter(null);
        setLoading(true);
        fetchServices(null);
    };

    const openBooking = (service) => setSelectedService(service);
    const closeBooking = () => setSelectedService(null);

    if (loading) return (
        <div className="page-loading">
            <div className="spinner" />
            <span>Loading services...</span>
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

                    {/* Location filter indicator */}
                    {locationFilter && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', border: '1px solid var(--border-focus)', borderRadius: '999px', padding: '5px 12px', fontSize: '0.85rem', fontWeight: '700' }}>
                            <HiOutlineLocationMarker style={{ flexShrink: 0 }} />
                            Showing near "{locationFilter}"
                            <button onClick={clearLocationFilter} title="Show all services" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-color)', display: 'flex', padding: '0 0 0 4px', lineHeight: 1 }}>
                                <HiX />
                            </button>
                        </div>
                    )}
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
                            className={service.requiresAppointment ? 'btn-primary' : 'btn-primary'}
                            style={{
                                width: '100%', padding: '14px',
                                backgroundColor: service.requiresAppointment ? undefined : 'var(--success-color)'
                            }}
                        >
                            {service.requiresAppointment ? '📅 Book Appointment' : '⚡ Book Now'}
                        </button>
                    </div>
                ))}
            </div>

            {services.length === 0 && (
                <div className="empty-state">
                    <HiOutlineInformationCircle className="empty-state-icon" />
                    <h3>{locationFilter ? `No services found near "${locationFilter}"` : 'No services listed yet'}</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
                        {locationFilter
                            ? <span>Try <button onClick={clearLocationFilter} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: '700', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>showing all services</button> instead.</span>
                            : 'Check back soon for new local services in your area.'}
                    </p>
                </div>
            )}

            {selectedService && (
                <BookingForm
                    serviceId={selectedService._id}
                    serviceTitle={selectedService.title}
                    requiresAppointment={selectedService.requiresAppointment ?? false}
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
