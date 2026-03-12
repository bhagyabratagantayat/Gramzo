import { NavLink } from 'react-router-dom';
import {
    HiOutlineHome,
    HiOutlineShoppingBag,
    HiOutlineCollection,
    HiOutlineChartBar,
    HiOutlineSpeakerphone,
    HiOutlineCurrencyRupee,
    HiOutlinePlusCircle
} from 'react-icons/hi';

const AgentNavbar = ({ onLinkClick }) => {
    const links = [
        { to: '/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
        { to: '/my-listings', icon: HiOutlineCollection, label: 'My Listings' },
        { to: '/agent/marketplace', icon: HiOutlineShoppingBag, label: 'Marketplace' },
        { to: '/earnings', icon: HiOutlineChartBar, label: 'Earnings' },
        { to: '/prices', icon: HiOutlineCurrencyRupee, label: 'Market Price' },
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
                    >
                        <Icon className="nav-icon hide-desktop" />
                        <span>{label}</span>
                    </NavLink>
                </li>
            ))}
        </>
    );
};

export default AgentNavbar;
