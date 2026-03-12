import { NavLink } from 'react-router-dom';
import {
    HiOutlineHome,
    HiOutlineShoppingBag,
    HiOutlineCalendar,
    HiOutlineCollection,
    HiOutlineUser
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const BottomNav = () => {
    const { user } = useAuth();

    const getLinks = () => {
        const baseLinks = [
            { to: '/', icon: HiOutlineHome, label: 'Home' },
            { to: '/services', icon: HiOutlineCollection, label: 'Services' },
            { to: '/marketplace', icon: HiOutlineShoppingBag, label: 'Market' },
        ];

        if (!user) {
            return [
                ...baseLinks,
                { to: '/login', icon: HiOutlineCalendar, label: 'Orders' },
                { to: '/login', icon: HiOutlineUser, label: 'Profile' },
            ];
        }

        const ordersLink = user.role === 'Admin' ? '/all-bookings' : (user.role === 'Agent' ? '/dashboard' : '/bookings');
        const profileLink = '/dashboard';

        return [
            ...baseLinks,
            { to: ordersLink, icon: HiOutlineCalendar, label: 'Orders' },
            { to: profileLink, icon: HiOutlineUser, label: 'Profile' },
        ];
    };

    return (
        <nav className="bottom-nav">
            {getLinks().map(({ to, icon: Icon, label }) => (
                <NavLink
                    key={to + label}
                    to={to}
                    className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
                    end={to === '/'}
                >
                    <Icon className="bottom-nav-icon" />
                    <span>{label}</span>
                </NavLink>
            ))}
        </nav>
    );
};

export default BottomNav;
