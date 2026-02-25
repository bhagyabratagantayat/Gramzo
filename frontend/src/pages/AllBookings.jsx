import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Bookings are now managed inside the Admin Dashboard (/admin → Bookings tab)
const AllBookings = () => {
    const navigate = useNavigate();
    useEffect(() => { navigate('/admin', { replace: true }); }, [navigate]);
    return null;
};

export default AllBookings;
