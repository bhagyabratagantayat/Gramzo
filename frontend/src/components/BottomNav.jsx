import { NavLink } from 'react-router-dom';
import {
    HiOutlineHome,
    HiOutlineShoppingBag,
    HiOutlineCalendar,
    HiOutlineChartBar,
    HiOutlineUser
} from 'react-icons/hi';
import { getUser } from '../services/auth';

const BottomNav = () => {
    const user = getUser();
    const isAgent = user?.role === 'Agent';

    return (
        <nav className="bottom-nav">
            <NavLink to="/" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`} end>
                <HiOutlineHome className="bottom-nav-icon" />
                <span>Home</span>
            </NavLink>
            <NavLink to={isAgent ? "/agent/marketplace" : "/marketplace"} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <HiOutlineShoppingBag className="bottom-nav-icon" />
                <span>Market</span>
            </NavLink>
            <NavLink to="/bookings" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <HiOutlineCalendar className="bottom-nav-icon" />
                <span>Bookings</span>
            </NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <HiOutlineChartBar className="bottom-nav-icon" />
                <span>Dash</span>
            </NavLink>
            <NavLink to="/login" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <HiOutlineUser className="bottom-nav-icon" />
                <span>Profile</span>
            </NavLink>
        </nav>
    );
};

export default BottomNav;
