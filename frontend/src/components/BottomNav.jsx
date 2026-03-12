import { NavLink } from 'react-router-dom';
import {
    HiOutlineHome,
    HiOutlineShoppingBag,
    HiOutlineCalendar,
    HiOutlineChartBar,
    HiOutlineBell,
    HiOutlineShieldCheck,
    HiOutlineCollection
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const BottomNav = () => {
    const { user } = useAuth();

    const getLinks = () => {
        if (!user) return [
            { to: '/', icon: HiOutlineHome, label: 'Home' },
            { to: '/marketplace', icon: HiOutlineShoppingBag, label: 'Shop' },
            { to: '/login', icon: HiOutlineCalendar, label: 'Bookings' },
            { to: '/login', icon: HiOutlineChartBar, label: 'Login' }
        ];

        if (user.role === 'Admin') return [
            { to: '/admin', icon: HiOutlineShieldCheck, label: 'Admin' },
            { to: '/all-bookings', icon: HiOutlineCollection, label: 'Bookings' },
            { to: '/dashboard', icon: HiOutlineChartBar, label: 'Stats' },
            { to: '/notifications', icon: HiOutlineBell, label: 'Alerts' }
        ];

        if (user.role === 'Agent') return [
            { to: '/dashboard', icon: HiOutlineHome, label: 'Dash' },
            { to: '/my-listings', icon: HiOutlineCollection, label: 'Items' },
            { to: '/agent/marketplace', icon: HiOutlineShoppingBag, label: 'Market' },
            { to: '/earnings', icon: HiOutlineChartBar, label: 'Earnings' }
        ];

        return [
            { to: '/', icon: HiOutlineHome, label: 'Home' },
            { to: '/marketplace', icon: HiOutlineShoppingBag, label: 'Shop' },
            { to: '/bookings', icon: HiOutlineCalendar, label: 'Orders' },
            { to: '/dashboard', icon: HiOutlineChartBar, label: 'Dash' }
        ];
    };

    return (
        <nav className="bottom-nav">
            {getLinks().map(({ to, icon: Icon, label }) => (
                <NavLink
                    key={to}
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
