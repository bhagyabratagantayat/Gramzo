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

            if (user?.role === 'Agent' && user?.agentId) {
                params.set('agent', user.agentId);
            } else if (locFilter) {
                params.set('locationName', locFilter);
            }

            const url = `/services${params.toString() ? '?' + params.toString() : ''}`;
            const response = await api.get(url);
            const data = response.data.data;
            setServices(data.length > 0 ? data : (user?.role === 'Agent' ? [] : demoServices));
        } catch {
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
                <div className="service-grid">
                    {services.map((service) => {
                        const catName = service.category?.name || '';
                        return (
                            <div key={service._id} className="service-card">
                                {/* Card image / icon area */}
                                <div className="service-card-img">
                                    <span style={{ fontSize: '3.5rem' }}>{icon(catName)}</span>
                                    {service.requiresAppointment && (
                                        <span className="service-card-badge">Appointment</span>
                                    )}
                                </div>

                                {/* Card body */}
                                <div className="service-card-body">
                                    {catName && <div className="service-card-category">{catName}</div>}
                                    <h3 className="service-card-title">{service.title}</h3>
                                    <p className="service-card-desc">{service.description}</p>

                                    {/* Meta row */}
                                    <div className="service-card-meta">
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                            <HiOutlineLocationMarker /> {service.locationName || service.location || 'Local area'}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                            <HiOutlineUserCircle /> {service.agent?.name || 'Verified Pro'}
                                        </span>
                                    </div>

                                    {/* Price */}
                                    <div className="service-card-price">
                                        ₹{service.price} <span>/ visit</span>
                                    </div>
                                </div>

                                {/* Card footer — CTA button */}
                                <div className="service-card-footer">
                                    <button
                                        onClick={() => openBooking(service)}
                                        className="btn-primary btn-full"
                                        style={!service.requiresAppointment ? { backgroundColor: 'var(--success-color)' } : {}}
                                    >
                                        {service.requiresAppointment
                                            ? <><HiOutlineCalendar /> Book Appointment</>
                                            : <><HiOutlineLightningBolt /> Book Now</>}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
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
