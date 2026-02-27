import { useState, useEffect } from 'react';
import api from '../services/api';
import BookingForm from '../components/BookingForm';
import AddServiceForm from '../components/AddServiceForm';
import { isAgent } from '../services/auth';
import { demoServices } from '../services/demoData';
import { getSavedLocation } from '../services/location';
import {
    HiOutlineLocationMarker, HiOutlineInformationCircle,
    HiOutlineUserCircle, HiX, HiOutlinePlusCircle,
    HiOutlineCurrencyRupee, HiOutlineCalendar, HiOutlineLightningBolt
} from 'react-icons/hi';
import { getFallbackImage } from '../utils/imageHelper';

/* Category icon map (emoji fallback) */
const CATEGORY_ICONS = {
    plumbing: '🔧', electrical: '⚡', cleaning: '🧹', carpentry: '🪚',
    tailoring: '🧵', beauty: '💆', painting: '🎨', gardening: '🌿',
    default: '🛠️'
};
const icon = (cat = '') => CATEGORY_ICONS[cat.toLowerCase()] ?? CATEGORY_ICONS.default;

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [locationFilter, setLocationFilter] = useState(() => {
        const saved = getSavedLocation();
        return saved?.locationName && saved.source !== 'skipped' ? saved.locationName : null;
    });

    const fetchServices = async (locFilter = locationFilter) => {
        try {
            const user = JSON.parse(localStorage.getItem('gramzoUser'));
            const params = new URLSearchParams();

            if (user?.role === 'Agent' && user?._id) {
                params.set('agent', user._id);
            } else if (locFilter) {
                params.set('locationName', locFilter);
            }

            const url = `/services${params.toString() ? '?' + params.toString() : ''}`;
            const response = await api.get(url);
            const data = response.data.data;
            setServices(data.length > 0 ? data : (user?.role === 'Agent' ? [] : demoServices));
        } catch {
            setServices(demoServices);
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
            <span>Loading services…</span>
        </div>
    );

    return (
        <div className="page-wrapper">
            {/* Page Header */}
            <header className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <div className="section-eyebrow">Community Support</div>
                    <h1 className="section-title">Local Services</h1>
                    <p className="section-sub">Trusted professionals in your neighbourhood.</p>

                    {/* Location filter chip */}
                    {locationFilter && (
                        <div className="filter-chip" style={{ marginTop: '12px' }}>
                            <HiOutlineLocationMarker />
                            Showing near &ldquo;{locationFilter}&rdquo;
                            <button
                                onClick={clearLocationFilter}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', padding: '0 0 0 2px', lineHeight: 1 }}
                                title="Show all services"
                            >
                                <HiX />
                            </button>
                        </div>
                    )}
                </div>

                {isAgent() && (
                    <button onClick={() => setShowAddForm(true)} className="btn-primary" style={{ gap: '6px' }}>
                        <HiOutlinePlusCircle /> List New Service
                    </button>
                )}
            </header>

            {/* Service Grid */}
            {services.length === 0 ? (
                <div className="empty-state">
                    <HiOutlineInformationCircle className="empty-state-icon" />
                    <h3>{locationFilter ? `No services near "${locationFilter}"` : 'No services listed yet'}</h3>
                    <p>
                        {locationFilter ? (
                            <>Try <button onClick={clearLocationFilter} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>showing all services</button> instead.</>
                        ) : 'Check back soon for new local services in your area.'}
                    </p>
                </div>
            ) : (
                <div className="responsive-grid">
                    {services.map((service) => {
                        const catName = service.category?.name || '';
                        return (
                            <div key={service._id} className="standard-card">
                                <div className="card-image-wrapper">
                                    <img
                                        src={service.image || getFallbackImage(service.title, service.category?.name)}
                                        alt={service.title}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = getFallbackImage(service.title, service.category?.name);
                                        }}
                                    />
                                    {service.requiresAppointment && (
                                        <span style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800 }}>Appointment</span>
                                    )}
                                </div>

                                <div className="card-content">
                                    {catName && <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-color)', letterSpacing: '0.05em' }}>{catName}</div>}
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '4px 0 8px' }}>{service.title}</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>{service.description}</p>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '16px' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                            <HiOutlineLocationMarker /> {service.locationName || service.location || 'Local area'}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                            <HiOutlineUserCircle /> {service.agent?.name || 'Verified Pro'}
                                        </span>
                                    </div>

                                    <div style={{ marginTop: 'auto' }}>
                                        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '16px' }}>
                                            ₹{service.price} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ visit</span>
                                        </div>
                                        <button
                                            onClick={() => openBooking(service)}
                                            className="btn-primary"
                                            style={{ width: '100%', justifyContent: 'center' }}
                                        >
                                            {service.requiresAppointment
                                                ? <><HiOutlineCalendar /> Book Appointment</>
                                                : <><HiOutlineLightningBolt /> Book Now</>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modals */}
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
