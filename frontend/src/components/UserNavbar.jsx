import { NavLink } from 'react-router-dom';
import {
    HiOutlineHome,
    HiOutlineCollection,
    HiOutlineShoppingBag,
    HiOutlineCalendar,
    HiOutlineSpeakerphone,
    HiOutlineCurrencyRupee
} from 'react-icons/hi';

const UserNavbar = ({ onLinkClick }) => {
    const links = [
        { to: '/', icon: HiOutlineHome, label: 'Home' },
        { to: '/marketplace', icon: HiOutlineShoppingBag, label: 'Marketplace' },
        { to: '/services', icon: HiOutlineCollection, label: 'Services' },
        { to: '/prices', icon: HiOutlineCurrencyRupee, label: 'Market Price' },
        { to: '/bookings', icon: HiOutlineCalendar, label: 'My Bookings' },
        { to: '/notifications', icon: HiOutlineSpeakerphone, label: 'Notifications' },
    ];

    return (
        <>
            {links.map(({ to, icon: Icon, label }) => (
                <li key={to}>
                    <NavLink
                        to={to}
                        className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                        onClick={onLinkClick}
                        end={to === '/'}
                    >
                        <Icon className="nav-icon hide-desktop" />
                        <span>{label}</span>
                    </NavLink>
                </li>
            ))}
        </>
    );
};

export default UserNavbar;
