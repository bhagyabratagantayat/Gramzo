import { NavLink } from 'react-router-dom';
import {
    HiOutlineShieldCheck,
    HiOutlineUserGroup,
    HiOutlineCollection,
    HiOutlineSpeakerphone,
    HiOutlineChartBar,
    HiOutlineShoppingBag
} from 'react-icons/hi';

const AdminNavbar = ({ onLinkClick }) => {
    const links = [
        { to: '/admin', icon: HiOutlineShieldCheck, label: 'Admin Panel' },
        { to: '/dashboard', icon: HiOutlineChartBar, label: 'System Analytics' },
        { to: '/all-bookings', icon: HiOutlineCollection, label: 'All Bookings' },
        { to: '/marketplace', icon: HiOutlineShoppingBag, label: 'Manage Products' },
        { to: '/notifications', icon: HiOutlineSpeakerphone, label: 'Post Update' },
    ];

    return (
        <>
            {links.map(({ to, icon: Icon, label }) => (
                <li key={to}>
                    <NavLink
                        to={to}
                        className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                        onClick={onLinkClick}
                    >
                        <Icon className="nav-icon hide-desktop" />
                        <span>{label}</span>
                    </NavLink>
                </li>
            ))}
        </>
    );
};

export default AdminNavbar;
