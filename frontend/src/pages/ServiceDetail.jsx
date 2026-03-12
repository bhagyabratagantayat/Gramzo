import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookingForm from '../components/BookingForm';
import {
    HiOutlineArrowLeft,
    HiOutlineCalendar,
    HiOutlineLocationMarker,
    HiOutlineUserCircle,
    HiOutlineLightningBolt,
    HiOutlineClock,
    HiOutlineCheckCircle,
    HiOutlinePhone,
    HiOutlineChatAlt2
} from 'react-icons/hi';
import { getFallbackImage } from '../utils/imageHelper';

const DEFAULT_PHONE = "911234567890"; // Admin's default number

const ServiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showBooking, setShowBooking] = useState(false);

    const contactPhone = service?.phone || service?.agentId?.phone || DEFAULT_PHONE;

    const handleContact = () => {
        const message = `Halo, I'm interested in your service: ${service.title}`;
        window.open(`https://wa.me/${contactPhone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await api.get(`/services/${id}`);
                setService(response.data.data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch service details', err);
                setError('Service not found or connection error.');
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [id]);

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: '16px' }}>
            <div className="spinner"></div>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Loading service profile...</span>
        </div>
    );

    if (error || !service) return (
        <div style={{ maxWidth: '600px', margin: '100px auto', textAlign: 'center', padding: '40px', backgroundColor: '#fff', borderRadius: '20px', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🛠️</div>
            <h2 style={{ marginBottom: '12px' }}>{error || 'Service Not Found'}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>This service profile might have been closed or the link is broken.</p>
            <button onClick={() => navigate('/services')} className="btn-primary">Back to Services</button>
        </div>
    );

    return (
        <div className="service-detail-container app-container py-12">
            <button
                onClick={() => navigate(-1)}
                className="btn-back mb-8"
            >
                <HiOutlineArrowLeft /> Back
            </button>

            <div className="detail-grid">
                {/* Visual Section */}
                <div className="detail-visual-column">
                    <div className="detail-image-card">
                        <img
                            src={service.image || getFallbackImage(service.title, service.category?.name)}
                            alt={service.title}
                            className="detail-main-img"
                            onError={(e) => { e.target.src = getFallbackImage(service.title, service.category?.name); }}
                        />
                    </div>

                    <div className="detail-features-list mt-8">
                        <h3 className="text-lg font-extrabold mb-4">What's Included:</h3>
                        <div className="feature-items">
                            {['Verified Professional', 'Service Warranty', 'Price Transparency', 'On-time Guarantee'].map(item => (
                                <div key={item} className="feature-item">
                                    <HiOutlineCheckCircle className="text-emerald-500 text-xl" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="detail-info-pane">
                    <div className="detail-eyebrow-row">
                        <div className="detail-eyebrow flex-center gap-1">
                            <HiOutlineLightningBolt /> {service.category?.name || 'Local Service'}
                        </div>
                    </div>
                    
                    <h1 className="detail-title">{service.title}</h1>

                    <div className="detail-price-display">
                        <span className="price-amount">₹{service.price}</span>
                        <span className="price-unit">/ consultation</span>
                    </div>

                    <div className="detail-section-card">
                        <h3>About this Service</h3>
                        <p>
                            {service.description || "Our community-verified experts provide high-quality services tailored to your needs. This service is part of Gramzo's initiative to boost local livelihoods."}
                        </p>
                    </div>

                    <div className="detail-stats-grid">
                        <div className="detail-stat-card">
                            <HiOutlineClock className="stat-icon" />
                            <div className="stat-label">Available</div>
                            <div className="stat-value">{service.availableTime || 'Flexible'}</div>
                        </div>
                        <div className="detail-stat-card">
                            <HiOutlineLocationMarker className="stat-icon" />
                            <div className="stat-label">Location</div>
                            <div className="stat-value">{service.locationName || service.location || 'Local area'}</div>
                        </div>
                    </div>

                    <div className="provider-info-card">
                        <div className="provider-avatar">
                            <HiOutlineUserCircle />
                        </div>
                        <div className="provider-details">
                            <div className="provider-label">Service Provided by</div>
                            <div className="provider-name">{service.agentId?.name || 'Verified Agent'}</div>
                        </div>
                    </div>

                    <div className="detail-action-footer">
                        {isAuthenticated ? (
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowBooking(true)}
                                    className="btn-primary flex-2 py-4 text-lg rounded-2xl"
                                >
                                    <HiOutlineCalendar /> {service.requiresAppointment ? 'Select Slot & Book' : 'Book Instantly'}
                                </button>
                                <button
                                    onClick={handleContact}
                                    className="btn-secondary flex-1 py-4 text-lg rounded-2xl flex-center gap-2"
                                >
                                    <HiOutlineChatAlt2 /> Contact
                                </button>
                            </div>
                        ) : (
                            <div className="detail-login-alert">
                                <p>Ready to book? Login to see available slots.</p>
                                <button onClick={() => navigate('/login')} className="btn-primary mt-4 py-3 px-8 mx-auto block">Login Now</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showBooking && (
                <BookingForm
                    serviceId={service._id}
                    serviceTitle={service.title}
                    requiresAppointment={service.requiresAppointment ?? false}
                    onClose={() => setShowBooking(false)}
                />
            )}
        </div>
    );
};

export default ServiceDetail;
