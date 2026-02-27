import { NavLink } from 'react-router-dom';
import {
    HiOutlineHome,
    HiOutlineShoppingBag,
    HiOutlineCalendar,
    HiOutlineChartBar,
    HiOutlineUser
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const BottomNav = () => {
    const { user, isAgent } = useAuth();

    return (
        <nav className="bottom-nav">
            <NavLink to="/" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`} end>
                <HiOutlineHome className="bottom-nav-icon" />
                <span>Home</span>
            </NavLink>
            <NavLink to={user ? (isAgent ? "/agent/marketplace" : "/marketplace") : "/login"} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <HiOutlineShoppingBag className="bottom-nav-icon" />
                <span>Market</span>
            </NavLink>
            <NavLink to={user ? "/bookings" : "/login"} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <HiOutlineCalendar className="bottom-nav-icon" />
                <span>Bookings</span>
            </NavLink>
            <NavLink to={user ? "/dashboard" : "/login"} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <HiOutlineChartBar className="bottom-nav-icon" />
                <span>Dash</span>
            </NavLink>
            <NavLink to={user ? "/dashboard" : "/login"} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <HiOutlineUser className="bottom-nav-icon" />
                <span>Profile</span>
            </NavLink>
        </nav>
    );
};

export default BottomNav;
