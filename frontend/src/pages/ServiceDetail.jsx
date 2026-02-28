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
    HiOutlineCheckCircle
} from 'react-icons/hi';
import { getFallbackImage } from '../utils/imageHelper';

const ServiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showBooking, setShowBooking] = useState(false);

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
        <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
            <button
                onClick={() => navigate(-1)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', color: 'var(--text-muted)', fontWeight: 700, cursor: 'pointer', marginBottom: '32px', fontSize: '1rem' }}
                onMouseEnter={e => e.target.style.color = 'var(--primary-color)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >
                <HiOutlineArrowLeft /> Back
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }} className="grid-2-desktop">
                {/* Visual Section */}
                <div style={{ position: 'relative' }}>
                    <div className="card-premium" style={{ borderRadius: '24px', overflow: 'hidden', backgroundColor: '#fff', boxShadow: 'var(--shadow-lg)' }}>
                        <img
                            src={service.image || getFallbackImage(service.title, service.category?.name)}
                            alt={service.title}
                            style={{ width: '100%', height: 'auto', maxHeight: '450px', objectFit: 'cover', display: 'block' }}
                            onError={(e) => { e.target.src = getFallbackImage(service.title, service.category?.name); }}
                        />
                    </div>

                    <div style={{ marginTop: '24px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>What's Included:</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {['Verified Professional', 'Service Warranty', 'Price Transparency', 'On-time Guarantee'].map(item => (
                                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#374151', fontSize: '0.95rem' }}>
                                    <HiOutlineCheckCircle style={{ color: 'var(--success-color)', fontSize: '1.3rem' }} />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div>
                        <div style={{ color: 'var(--primary-color)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <HiOutlineLightningBolt /> {service.category?.name || 'Local Service'}
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: '0', letterSpacing: '-0.02em' }}>{service.title}</h1>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontSize: '2.4rem', fontWeight: 900, color: '#111827' }}>₹{service.price}</span>
                        <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ consultation</span>
                    </div>

                    <div className="card-premium" style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '20px' }}>
                        <h3 style={{ margin: '0 0 12px', fontSize: '1.1rem', fontWeight: 800 }}>About this Service</h3>
                        <p style={{ color: '#4b5563', lineHeight: '1.8', margin: 0 }}>
                            {service.description || "Our community-verified experts provide high-quality services tailored to your needs. This service is part of Gramzo's initiative to boost local livelihoods."}
                        </p>
                    </div>

                    <div className="responsive-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        <div className="card-premium" style={{ padding: '16px', backgroundColor: '#f9fafb', textAlign: 'center' }}>
                            <HiOutlineClock style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginBottom: '8px' }} />
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Available</div>
                            <div style={{ fontWeight: 800, color: '#111827' }}>{service.availableTime || 'Flexible'}</div>
                        </div>
                        <div className="card-premium" style={{ padding: '16px', backgroundColor: '#f9fafb', textAlign: 'center' }}>
                            <HiOutlineLocationMarker style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginBottom: '8px' }} />
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Location</div>
                            <div style={{ fontWeight: 800, color: '#111827' }}>{service.locationName || service.location || 'Local area'}</div>
                        </div>
                    </div>

                    <div className="card-premium" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#fff' }}>
                        <HiOutlineUserCircle style={{ fontSize: '3rem', color: '#cbd5e1' }} />
                        <div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>Service Provided by</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#111827' }}>{service.agentId?.name || 'Verified Agent'}</div>
                        </div>
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                        {isAuthenticated ? (
                            <button
                                onClick={() => setShowBooking(true)}
                                className="btn-primary"
                                style={{ width: '100%', padding: '18px', fontSize: '1.2rem', justifyContent: 'center', borderRadius: '16px' }}
                            >
                                <HiOutlineCalendar /> {service.requiresAppointment ? 'Select Slot & Book' : 'Book Instantly'}
                            </button>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fffbeb', borderRadius: '16px', border: '1px solid #fef3c7' }}>
                                <p style={{ margin: '0 0 12px', fontWeight: 700, color: '#92400e' }}>Ready to book? Login to see available slots.</p>
                                <button onClick={() => navigate('/login')} className="btn-primary" style={{ margin: '0 auto', backgroundColor: '#ea580c' }}>Login Now</button>
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

            <style>{`
                @media (min-width: 1024px) {
                    .grid-2-desktop {
                        grid-template-columns: 1fr 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ServiceDetail;
