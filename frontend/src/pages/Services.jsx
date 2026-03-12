import { useState, useEffect } from 'react';
import api from '../services/api';
import BookingForm from '../components/BookingForm';
import AddServiceForm from '../components/AddServiceForm';
import { useAuth } from '../context/AuthContext';
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
    const { user, isAgent, isAuthenticated } = useAuth();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [locationFilter, setLocationFilter] = useState(() => {
        const saved = getSavedLocation();
        return saved?.locationName && saved.source !== 'skipped' ? saved.locationName : null;
    });

    const [error, setError] = useState(null);

    const fetchServices = async (locFilter = locationFilter) => {
        try {
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
            setError(null);
        } catch (err) {
            console.error('Failed to fetch services', err);
            setServices(demoServices);
            setError('Showing offline services due to connection issue.');
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
        <div className="page-loading-full flex-col gap-4">
            <div className="spinner" />
            <span className="text-muted font-bold">Loading services…</span>
        </div>
    );

    return (
        <div className="services-container">
            {error && (
                <div className="alert alert-warning flex-center mt-4">
                    <span className="text-xl">⚠️</span> {error}
                </div>
            )}

            <header className="home-hero">
                <div className="app-container">
                    <div className="section-eyebrow">Community Support</div>
                    <h1 className="hero-title">Local Services</h1>
                    <p className="hero-subtitle">Trusted professionals in your neighbourhood.</p>

                    {/* Location filter chip */}
                    <div className="flex-center mt-6 gap-3 flex-wrap">
                        {locationFilter && (
                            <div className="filter-chip active">
                                <HiOutlineLocationMarker />
                                Near {locationFilter}
                                <button
                                    onClick={clearLocationFilter}
                                    className="filter-close"
                                    title="Show all services"
                                >
                                    <HiX />
                                </button>
                            </div>
                        )}
                        {isAgent && (
                            <button onClick={() => setShowAddForm(true)} className="btn-primary btn-sm rounded-full">
                                <HiOutlinePlusCircle /> List New Service
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <div className="app-container py-12">
                {services.length === 0 ? (
                    <div className="empty-state">
                        <HiOutlineInformationCircle className="empty-state-icon" />
                        <h3>{locationFilter ? `No services near "${locationFilter}"` : 'No services listed yet'}</h3>
                        <p>
                            {locationFilter ? (
                                <>Try <button onClick={clearLocationFilter} className="text-primary font-bold">showing all services</button> instead.</>
                            ) : 'Check back soon for new local services in your area.'}
                        </p>
                    </div>
                ) : (
                    <div className="responsive-grid">
                        {services.map((service) => {
                            const catName = service.category?.name || '';
                            return (
                                <div key={service._id} className="standard-card hover-lift card-premium">
                                    <div className="card-image-wrapper">
                                        <img
                                            src={service.image || getFallbackImage(service.title, service.category?.name)}
                                            alt={service.title}
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = getFallbackImage(service.title, service.category?.name);
                                            }}
                                        />
                                        {service.requiresAppointment && (
                                            <div className="card-badge-top badge glass-morphism">Appointment</div>
                                        )}
                                    </div>

                                    <div className="card-content">
                                        {catName && <div className="card-category-eyebrow">{catName}</div>}
                                        <h3 className="card-title-medium">{service.title}</h3>
                                        <p className="card-desc-short">{service.description}</p>

                                        <div className="card-meta-row">
                                            <span className="card-meta-item">
                                                <HiOutlineLocationMarker /> {service.locationName || service.location || 'Local area'}
                                            </span>
                                            <span className="card-meta-item">
                                                <HiOutlineUserCircle /> {service.agent?.name?.split(' ')[0] || 'Verified Pro'}
                                            </span>
                                        </div>

                                        <div className="mt-auto">
                                            <div className="text-price-large mb-4">
                                                ₹{service.price} <span className="text-xs font-normal opacity-70">/ visit</span>
                                            </div>
                                            <button
                                                onClick={() => isAuthenticated ? openBooking(service) : window.location.href = '/login'}
                                                className="btn-primary btn-full flex-center gap-2"
                                            >
                                                {!isAuthenticated
                                                    ? 'Login to Book'
                                                    : (service.requiresAppointment
                                                        ? <><HiOutlineCalendar /> Book Appointment</>
                                                        : <><HiOutlineLightningBolt /> Book Now</>)}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

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
                    onServiceAdded={() => fetchServices()}
                />
            )}
        </div>
    );
};

export default Services;
