import { useState, useEffect } from 'react';
import api from '../services/api';
import BookingForm from '../components/BookingForm';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await api.get('/services');
                setServices(response.data.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch services. Please try again later.');
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const openBooking = (service) => {
        setSelectedService(service);
    };

    const closeBooking = () => {
        setSelectedService(null);
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading services...</div>;
    if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Available Services</h1>
            <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {services.map((service) => (
                    <div key={service._id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
                        <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>{service.title}</h2>
                        <p style={{ color: '#666', flex: 1 }}>{service.description}</p>
                        <p><strong>Price:</strong> ₹{service.price}</p>
                        <p><strong>Location:</strong> {service.location}</p>
                        <p><strong>Agent:</strong> {service.agent?.name || 'N/A'}</p>
                        <button
                            onClick={() => openBooking(service)}
                            style={{
                                marginTop: '15px',
                                padding: '10px',
                                backgroundColor: '#28a745',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Book Now
                        </button>
                    </div>
                ))}
                {services.length === 0 && <p>No services found matching your criteria.</p>}
            </div>

            {selectedService && (
                <BookingForm
                    serviceId={selectedService._id}
                    serviceTitle={selectedService.title}
                    onClose={closeBooking}
                />
            )}
        </div>
    );
};

export default Services;
